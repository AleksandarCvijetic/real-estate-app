import { apiClient } from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/users/auth/register", data).then((res) => res.data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/users/auth/login", data).then((res) => res.data),

  logout: (refreshToken: string) =>
    apiClient.post<void>("/users/auth/logout", { refreshToken }).then((res) => res.data),
};
