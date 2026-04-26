import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productsApi } from "../api/products";
import { Product, ProductFilters, ProductListResponse } from "../types/product";

interface ProductState {
  list: ProductListResponse | null;
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  list: null,
  currentProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchList",
  async (filters: ProductFilters, { rejectWithValue }) => {
    try {
      const res = await productsApi.list(filters);
      return res.data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? "Failed to fetch products";
      return rejectWithValue(msg);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await productsApi.getById(id);
      return res.data;
    } catch {
      return rejectWithValue("Product not found");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })

      .addCase(fetchProductById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.currentProduct = a.payload; })
      .addCase(fetchProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
