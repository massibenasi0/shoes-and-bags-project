export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "customer" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
