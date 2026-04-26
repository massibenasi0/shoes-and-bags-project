import productReducer, { clearCurrentProduct } from "../../store/productSlice";

const mockProduct = {
  id: "p1",
  name: "Test Shoe",
  slug: "test-shoe",
  description: "A great shoe",
  price: 99.99,
  compare_at_price: null,
  category_id: "c1",
  images: [],
  sizes: ["40", "41"],
  colors: ["Black"],
  stock: 5,
  is_featured: false,
  is_active: true,
  brand: null,
  created_at: "2024-01-01T00:00:00Z",
};

describe("productSlice", () => {
  it("returns initial state", () => {
    const state = productReducer(undefined, { type: "@@INIT" });
    expect(state.list).toBeNull();
    expect(state.currentProduct).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("clearCurrentProduct sets currentProduct to null", () => {
    const state = productReducer(
      { list: null, currentProduct: mockProduct, loading: false, error: null },
      clearCurrentProduct()
    );
    expect(state.currentProduct).toBeNull();
  });
});
