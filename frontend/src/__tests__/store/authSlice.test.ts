import authReducer, { logout, clearError } from "../../store/authSlice";

const mockUser = {
  id: "u1",
  email: "test@example.com",
  full_name: "Test User",
  role: "customer" as const,
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
};

const authenticatedState = {
  user: mockUser,
  isAuthenticated: true,
  loading: false,
  error: null,
};

describe("authSlice", () => {
  it("returns default initial state", () => {
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.user).toBeNull();
  });

  it("logout clears user and isAuthenticated", () => {
    const state = authReducer(authenticatedState, logout());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("clearError sets error to null", () => {
    const state = authReducer(
      { ...authenticatedState, error: "some error" },
      clearError()
    );
    expect(state.error).toBeNull();
  });
});
