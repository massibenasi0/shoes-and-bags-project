import orderReducer, {
  clearOrderError,
  clearCurrentOrder,
} from "../../store/orderSlice";

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

describe("orderSlice", () => {
  it("returns the initial state", () => {
    const state = orderReducer(undefined, { type: "@@INIT" });
    expect(state.orders).toEqual([]);
    expect(state.currentOrder).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("clearOrderError sets error to null", () => {
    const state = orderReducer({ ...initialState, error: "some error" }, clearOrderError());
    expect(state.error).toBeNull();
  });

  it("clearCurrentOrder sets currentOrder to null", () => {
    const mockOrder = {
      id: "o1",
      user_id: "u1",
      status: "pending",
      total_amount: 99.99,
      shipping_address: { street: "1 St", city: "Warsaw", state: "MA", zip_code: "00-001", country: "Poland" },
      items: [],
      created_at: "2024-01-01T00:00:00Z",
    };
    const state = orderReducer({ ...initialState, currentOrder: mockOrder }, clearCurrentOrder());
    expect(state.currentOrder).toBeNull();
  });

  it("fetchOrders.pending sets loading to true", () => {
    const state = orderReducer(initialState, { type: "orders/fetchAll/pending" });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("fetchOrders.fulfilled sets orders and clears loading", () => {
    const orders = [
      {
        id: "o1", user_id: "u1", status: "confirmed", total_amount: 150,
        shipping_address: { street: "1 St", city: "Warsaw", state: "MA", zip_code: "00-001", country: "Poland" },
        items: [], created_at: "2024-01-01T00:00:00Z",
      },
    ];
    const state = orderReducer(
      { ...initialState, loading: true },
      { type: "orders/fetchAll/fulfilled", payload: orders }
    );
    expect(state.loading).toBe(false);
    expect(state.orders).toHaveLength(1);
    expect(state.orders[0].id).toBe("o1");
  });

  it("fetchOrders.rejected sets error", () => {
    const state = orderReducer(
      { ...initialState, loading: true },
      { type: "orders/fetchAll/rejected", payload: "Failed to fetch orders" }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Failed to fetch orders");
  });

  it("fetchOrder.fulfilled sets currentOrder", () => {
    const order = {
      id: "o1", user_id: "u1", status: "pending", total_amount: 99.99,
      shipping_address: { street: "1 St", city: "Warsaw", state: "MA", zip_code: "00-001", country: "Poland" },
      items: [], created_at: "2024-01-01T00:00:00Z",
    };
    const state = orderReducer(
      { ...initialState, loading: true },
      { type: "orders/fetchOne/fulfilled", payload: order }
    );
    expect(state.loading).toBe(false);
    expect(state.currentOrder?.id).toBe("o1");
  });
});
