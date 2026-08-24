import type { AuthUser } from "../lib/auth";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}
