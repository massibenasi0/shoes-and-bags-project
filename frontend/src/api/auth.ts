import { LoginData, RegisterData, TokenResponse, User } from "../types/user";
import apiClient from "./client";

export const authApi = {
  login: (data: LoginData) =>
    apiClient.post<TokenResponse>("/api/auth/login", data),

  register: (data: RegisterData) =>
    apiClient.post<TokenResponse>("/api/auth/register", data),

  getMe: () =>
    apiClient.get<User>("/api/auth/me"),

  refresh: (refreshToken: string) =>
    apiClient.post<TokenResponse>("/api/auth/refresh", { refresh_token: refreshToken }),

  googleLoginUrl: () =>
    `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/google/login`,
};
