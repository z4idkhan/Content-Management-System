// ============================================================
// Categories API service
// TODO: Update endpoints to match your headless CMS routes.
// ============================================================

import { apiClient } from "../client";
import type { Category } from "../types";

export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>("/categories"),

  getById: (id: string | number) => apiClient.get<Category>(`/categories/${id}`),

  create: (data: Omit<Category, "id" | "articleCount">) =>
    apiClient.post<Category>("/categories", data),

  update: (id: string | number, data: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  delete: (id: string | number) => apiClient.delete<void>(`/categories/${id}`),
};
