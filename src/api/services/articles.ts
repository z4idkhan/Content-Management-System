// ============================================================
// Articles API service
// TODO: Update endpoints to match your headless CMS routes.
// ============================================================

import { apiClient } from "../client";
import type { Article } from "../types";

export const articlesApi = {
  getAll: () => apiClient.get<Article[]>("/articles"),

  getById: (id: string | number) => apiClient.get<Article>(`/articles/${id}`),

  create: (data: Omit<Article, "id" | "views" | "date">) =>
    apiClient.post<Article>("/articles", data),

  update: (id: string | number, data: Partial<Article>) =>
    apiClient.put<Article>(`/articles/${id}`, data),

  delete: (id: string | number) => apiClient.delete<void>(`/articles/${id}`),
};
