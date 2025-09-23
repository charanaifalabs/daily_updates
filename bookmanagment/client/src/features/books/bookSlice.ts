import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { Book } from "./types";
import { AxiosError } from "axios";

interface UserBook {
  _id: string;
  book: Book;
}

interface BooksState {
  books: Book[];
  allBooks: Book[];
  borrowed: UserBook[];
  purchased: UserBook[];
  requests: BookRequest[];
  loading: boolean;
  error: string | null;
}

export interface BookRequest {
  _id?: string;
  action: "create" | "update" | "delete";
  bookId?: string;
  title?: string;
  author?: string;
  description?: string;
  publication?: string;
  price?: number;
  publishedYear?: number;
  status?: "pending" | "approved" | "rejected";
  requestedBy?: { name?: string } | null;
}

const initialState: BooksState = {
  books: [],
  allBooks: [],
  borrowed: [],
  purchased: [],
  requests: [],
  loading: false,
  error: null,
};

// Helper Function
const ensureArray = <T>(arr: T[] | undefined): T[] => arr || [];

// Fetch all books
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/books`);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);

// Fetch user-specific books (borrowed/purchased)
export const fetchUserBooks = createAsyncThunk(
  "books/fetchUserBooks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/action/me/list`);
      console.log("fetchUserBooks response:", res.data);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user books"
      );
    }
  }
);

// Add a book
export const addBook = createAsyncThunk(
  "books/addBook",
  async (bookData: Partial<Book>, { rejectWithValue }) => {
    try {
      const res = await api.post(`/books`, bookData);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to add book"
      );
    }
  }
);

// Update a book
export const updateBook = createAsyncThunk(
  "books/updateBook",
  async (
    { id, bookData }: { id: string; bookData: Partial<Book> },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/books/${id}`, bookData);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to update book"
      );
    }
  }
);

// Delete a book
export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/books/${id}`);
      return id;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete book"
      );
    }
  }
);

// Borrow a book
export const borrow = createAsyncThunk(
  "books/borrow",
  async ({ bookId }: { bookId: string }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/action/${bookId}/borrow`);
      console.log("borrow response:", res.data);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to borrow book"
      );
    }
  }
);

// Purchase a book
export const purchase = createAsyncThunk(
  "books/purchase",
  async (
    { bookId, price }: { bookId: string; price?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`/action/${bookId}/purchase`, { price });
      console.log("purchase response:", res.data);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to purchase book"
      );
    }
  }
);

// Return a book
export const returnBook = createAsyncThunk(
  "books/return",
  async ({ bookId }: { bookId: string }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/action/${bookId}/return`);
      console.log("return response:", res.data);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to return book"
      );
    }
  }
);

//  Book Requests (Librarian/Admin)
export const fetchBookRequests = createAsyncThunk(
  "books/fetchBookRequests",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching book requests...");
      const res = await api.get(`/book-requests`);
      console.log("Book requests response:", res.data);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error(
        "Fetch requests error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch requests"
      );
    }
  }
);

export const createBookRequest = createAsyncThunk<
  BookRequest,
  BookRequest,
  { rejectValue: string }
>("books/createBookRequest", async (payload, { rejectWithValue }) => {
  try {
    const body: Partial<BookRequest & { publishedYear?: number }> = {
      ...payload,
    };

    if (payload.publication) {
      const year = Number(payload.publication);
      if (!isNaN(year)) body.publishedYear = year;
    }

    const res = await api.post<BookRequest>("/book-requests", body);
    return res.data;
  } catch (err) {
    let message = "Failed to create request";

    if (
      err &&
      (err as AxiosError<{ message: string }>).response?.data?.message
    ) {
      message = (err as AxiosError<{ message: string }>).response!.data.message;
    }

    return rejectWithValue(message);
  }
});

export const handleBookRequest = createAsyncThunk(
  "books/handleBookRequest",
  async (
    { id, status }: { id: string; status: "approved" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/book-requests/${id}/handle`, { status });
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to handle request"
      );
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    resetBooksState: (state) => {
      state.books = [];
      state.allBooks = [];
      state.borrowed = [];
      state.purchased = [];
      state.requests = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all books
    builder.addCase(fetchBooks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchBooks.fulfilled,
      (state, action: PayloadAction<Book[]>) => {
        state.loading = false;
        state.allBooks = ensureArray(action.payload);
      }
    );
    builder.addCase(fetchBooks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch user books
    builder.addCase(fetchUserBooks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUserBooks.fulfilled,
      (
        state,
        action: PayloadAction<{ borrowed: UserBook[]; purchased: UserBook[] }>
      ) => {
        state.loading = false;
        state.borrowed = ensureArray(action.payload.borrowed);
        state.purchased = ensureArray(action.payload.purchased);
      }
    );
    builder.addCase(fetchUserBooks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add book
    builder.addCase(addBook.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addBook.fulfilled, (state, action: PayloadAction<Book>) => {
      state.loading = false;
      if (!state.allBooks) state.allBooks = [];
      state.allBooks.push(action.payload);
    });
    builder.addCase(addBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update book
    builder.addCase(
      updateBook.fulfilled,
      (state, action: PayloadAction<Book>) => {
        if (state.allBooks) {
          state.allBooks = state.allBooks.map((b) =>
            b._id === action.payload._id ? action.payload : b
          );
        }
      }
    );

    // Delete book
    builder.addCase(
      deleteBook.fulfilled,
      (state, action: PayloadAction<string>) => {
        if (state.allBooks) {
          state.allBooks = state.allBooks.filter(
            (b) => b._id !== action.payload
          );
        }
      }
    );

    // Borrow book
    builder.addCase(
      borrow.fulfilled,
      (state, action: PayloadAction<UserBook>) => {
        if (!state.borrowed) state.borrowed = [];
        state.borrowed.push(action.payload);
        if (state.allBooks) {
          state.allBooks = state.allBooks.map((b) =>
            b._id === action.payload.book._id ? { ...b, status: "borrowed" } : b
          );
        }
      }
    );

    // Purchase book
    builder.addCase(
      purchase.fulfilled,
      (state, action: PayloadAction<UserBook>) => {
        if (!state.purchased) state.purchased = [];
        state.purchased.push(action.payload);
        if (state.allBooks) {
          state.allBooks = state.allBooks.map((b) =>
            b._id === action.payload.book._id ? { ...b, status: "sold" } : b
          );
        }
      }
    );

    // Return book
    builder.addCase(
      returnBook.fulfilled,
      (state, action: PayloadAction<UserBook>) => {
        if (state.borrowed) {
          state.borrowed = state.borrowed.filter(
            (b) => b.book._id !== action.payload.book._id
          );
        }
        if (state.allBooks) {
          state.allBooks = state.allBooks.map((b) =>
            b._id === action.payload.book._id
              ? { ...b, status: "available" }
              : b
          );
        }
      }
    );

    // Requests
    builder.addCase(
      fetchBookRequests.fulfilled,
      (state, action: PayloadAction<BookRequest[]>) => {
        state.requests = ensureArray(action.payload);
      }
    );
    builder.addCase(
      createBookRequest.fulfilled,
      (state, action: PayloadAction<BookRequest>) => {
        if (!state.requests) state.requests = [];
        state.requests.unshift(action.payload);
      }
    );
    builder.addCase(
      handleBookRequest.fulfilled,
      (state, action: PayloadAction<BookRequest>) => {
        if (state.requests) {
          const idx = state.requests.findIndex(
            (r) => r._id === action.payload._id
          );
          if (idx !== -1) state.requests[idx] = action.payload;
        }
      }
    );
  },
});

export const { resetBooksState } = booksSlice.actions;
export default booksSlice.reducer;
