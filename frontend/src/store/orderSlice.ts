import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ordersApi, OrderResponse } from "../api/orders";

interface OrderState {
  orders: OrderResponse[];
  currentOrder: OrderResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await ordersApi.list();
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch orders");
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "orders/fetchOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await ordersApi.getById(id);
      return res.data;
    } catch {
      return rejectWithValue("Order not found");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload; })
      .addCase(fetchOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })

      .addCase(fetchOrder.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchOrder.fulfilled, (s, a) => { s.loading = false; s.currentOrder = a.payload; })
      .addCase(fetchOrder.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
