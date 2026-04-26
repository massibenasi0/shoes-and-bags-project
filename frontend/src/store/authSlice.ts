import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/auth";
import { LoginData, RegisterData, User } from "../types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const tokenRes = await authApi.login(data);
      localStorage.setItem("access_token", tokenRes.data.access_token);
      localStorage.setItem("refresh_token", tokenRes.data.refresh_token);
      const userRes = await authApi.getMe();
      return userRes.data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? "Login failed";
      return rejectWithValue(typeof msg === "string" ? msg : "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const tokenRes = await authApi.register(data);
      localStorage.setItem("access_token", tokenRes.data.access_token);
      localStorage.setItem("refresh_token", tokenRes.data.refresh_token);
      const userRes = await authApi.getMe();
      return userRes.data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? "Registration failed";
      return rejectWithValue(typeof msg === "string" ? msg : "Registration failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getMe();
      return res.data;
    } catch {
      return rejectWithValue("Session expired");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
    clearError(state) {
      state.error = null;
    },
    setTokensFromUrl(state, action) {
      const { access_token, refresh_token } = action.payload;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.isAuthenticated = true; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })

      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.isAuthenticated = true; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })

      .addCase(fetchCurrentUser.fulfilled, (s, a) => { s.user = a.payload; s.isAuthenticated = true; })
      .addCase(fetchCurrentUser.rejected, (s) => { s.isAuthenticated = false; s.user = null; });
  },
});

export const { logout, clearError, setTokensFromUrl } = authSlice.actions;
export default authSlice.reducer;
