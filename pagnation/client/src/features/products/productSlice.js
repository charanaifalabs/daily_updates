

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

// Fetch products with filters and pagination
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const { data } = await api.get("/api/products", { params });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  "products/create",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/api/products/create", payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Create failed"
      );
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/api/products/${id}`, payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/api/products/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    page: 1,
    pages: 1,
    status: "idle",
    error: null,
    filters: {
      category: "",
      minPrice: null,
      maxPrice: null,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { category: "", minPrice: null, maxPrice: null };
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchProducts.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload.data;
        s.total = a.payload.total;
        s.page = a.payload.page;
        s.pages = a.payload.pages;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // create
      .addCase(createProduct.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })

      // update
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.items = s.items.map((p) => (p._id === a.payload._id ? a.payload : p));
      })

      // delete
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p._id !== a.payload);
      });
  },
});

export const { setFilters, resetFilters, setPage } = productSlice.actions;

export default productSlice.reducer;
