// ============================================================
// Users API service
// TODO: Update endpoints to match your headless CMS routes.
// ============================================================

import { apiClient } from "../client";
import type { User } from "../types";

export const usersApi = {
  getAll: () => apiClient.get<User[]>("/users"),

  getById: (id: string | number) => apiClient.get<User>(`/users/${id}`),

  create: (data: Omit<User, "id" | "joined">) =>
    apiClient.post<User>("/users", data),

  update: (id: string | number, data: Partial<User>) =>
    apiClient.put<User>(`/users/${id}`, data),

  delete: (id: string | number) => apiClient.delete<void>(`/users/${id}`),
};
