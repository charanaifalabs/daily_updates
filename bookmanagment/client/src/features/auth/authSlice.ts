import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

//  User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

//  Book interface
export interface Book {
  _id: string;
  title: string;
  author: string;
  publication: string;
  language: string;
  price: number;
  description: string;
}

//  Auth + app state interface
interface AuthState {
  user: User | null;
  users: User[];
  books: Book[];
  token: string | null;
  emailForOtp: string | null;
  loading: boolean;
  error: string | null;
  otpVerified: boolean;
}

// localStorage
const userFromStorage = localStorage.getItem("user");
const tokenFromStorage = localStorage.getItem("token");

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  users: [],
  books: [],
  token: tokenFromStorage || null,
  emailForOtp: null,
  loading: false,
  error: null,
  otpVerified: tokenFromStorage ? true : false,
};

//  Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    payload: { name: string; email: string; password: string; role?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        payload
      );
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

//  Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        credentials
      );
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

//  Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/verify-otp",
        payload
      );
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

//  Fetch all users
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("auth/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5001/api/users", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});

//  Fetch all books
export const fetchBooks = createAsyncThunk<
  Book[],
  void,
  { rejectValue: string }
>("auth/fetchBooks", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5001/api/books", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch books"
    );
  }
});

//  Add book (Admin only)
export const addBook = createAsyncThunk<
  Book,
  Omit<Book, "_id">,
  { rejectValue: string }
>("auth/addBook", async (bookData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post("http://localhost:5001/api/books", bookData, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to add book"
    );
  }
});

//  Update book (Admin only)
export const updateBook = createAsyncThunk<
  Book,
  { id: string; data: Partial<Book> },
  { rejectValue: string }
>("auth/updateBook", async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(`http://localhost:5001/api/books/${id}`, data, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update book"
    );
  }
});

//  Delete book (Admin only)
export const deleteBook = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("auth/deleteBook", async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5001/api/books/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return id;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete book"
    );
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.users = [];
      state.books = [];
      state.token = null;
      state.emailForOtp = null;
      state.otpVerified = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ email: string }>) => {
          state.loading = false;
          state.emailForOtp = action.payload.email;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        verifyOtp.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;

          state.otpVerified = true;
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add book
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update book
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.loading = false;
        const index = state.books.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) state.books[index] = action.payload;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete book
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.books = state.books.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
