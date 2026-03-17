// ============================================================
// Tags API service
// TODO: Update endpoints to match your headless CMS routes.
// ============================================================

import { apiClient } from "../client";
import type { TagItem } from "../types";

export const tagsApi = {
  getAll: () => apiClient.get<TagItem[]>("/tags"),

  getById: (id: string | number) => apiClient.get<TagItem>(`/tags/${id}`),

  create: (data: Omit<TagItem, "id" | "articleCount">) =>
    apiClient.post<TagItem>("/tags", data),

  update: (id: string | number, data: Partial<TagItem>) =>
    apiClient.put<TagItem>(`/tags/${id}`, data),

  delete: (id: string | number) => apiClient.delete<void>(`/tags/${id}`),
};
