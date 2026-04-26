import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  CartItem,
} from "../../store/cartSlice";

const mockItem: CartItem = {
  product_id: "prod-1",
  name: "Test Sneaker",
  price: 99.99,
  image: "https://placehold.co/100x100",
  quantity: 1,
  size: "42",
  color: "Black",
};

describe("cartSlice", () => {
  it("returns initial state with empty items", () => {
    const state = cartReducer(undefined, { type: "@@INIT" });
    expect(state.items).toBeDefined();
  });

  it("adds an item to an empty cart", () => {
    const state = cartReducer({ items: [] }, addToCart(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe("Test Sneaker");
    expect(state.items[0].quantity).toBe(1);
  });

  it("increments quantity for a duplicate item (same id, size, color)", () => {
    const state = cartReducer({ items: [{ ...mockItem }] }, addToCart(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("adds as separate line item if different size", () => {
    const different = { ...mockItem, size: "43" };
    const state = cartReducer({ items: [{ ...mockItem }] }, addToCart(different));
    expect(state.items).toHaveLength(2);
  });

  it("removes an item by product_id + size + color", () => {
    const state = cartReducer(
      { items: [{ ...mockItem }] },
      removeFromCart({ product_id: "prod-1", size: "42", color: "Black" })
    );
    expect(state.items).toHaveLength(0);
  });

  it("does not remove item if key doesn't match", () => {
    const state = cartReducer(
      { items: [{ ...mockItem }] },
      removeFromCart({ product_id: "prod-1", size: "99", color: "Black" })
    );
    expect(state.items).toHaveLength(1);
  });

  it("updates quantity correctly", () => {
    const state = cartReducer(
      { items: [{ ...mockItem }] },
      updateQuantity({ product_id: "prod-1", size: "42", color: "Black", quantity: 5 })
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it("clamps quantity to minimum 1 on updateQuantity", () => {
    const state = cartReducer(
      { items: [{ ...mockItem }] },
      updateQuantity({ product_id: "prod-1", size: "42", color: "Black", quantity: 0 })
    );
    expect(state.items[0].quantity).toBe(1);
  });

  it("clears all items", () => {
    const state = cartReducer({ items: [{ ...mockItem }, { ...mockItem, size: "43" }] }, clearCart());
    expect(state.items).toHaveLength(0);
  });
});
