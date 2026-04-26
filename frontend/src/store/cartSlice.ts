import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

interface CartState {
  items: CartItem[];
}

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const persist = (items: CartItem[]) =>
  localStorage.setItem("cart", JSON.stringify(items));

const initialState: CartState = { items: loadCart() };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (i) =>
          i.product_id === action.payload.product_id &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      persist(state.items);
    },
    removeFromCart(
      state,
      action: PayloadAction<{ product_id: string; size: string; color: string }>
    ) {
      state.items = state.items.filter(
        (i) =>
          !(
            i.product_id === action.payload.product_id &&
            i.size === action.payload.size &&
            i.color === action.payload.color
          )
      );
      persist(state.items);
    },
    updateQuantity(
      state,
      action: PayloadAction<{
        product_id: string;
        size: string;
        color: string;
        quantity: number;
      }>
    ) {
      const item = state.items.find(
        (i) =>
          i.product_id === action.payload.product_id &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        persist(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
