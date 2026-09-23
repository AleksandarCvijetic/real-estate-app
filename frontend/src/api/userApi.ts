import { apiClient } from "./client";
import type { User } from "../types/user";

export const userApi = {
  getCurrentUser: () => apiClient.get<User>("/users/me").then((res) => res.data),

  getById: (id: number) => apiClient.get<User>(`/users/${id}`).then((res) => res.data),
};
