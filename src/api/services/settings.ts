// ============================================================
// Settings API service
// TODO: Update endpoints to match your headless CMS routes.
// ============================================================

import { apiClient } from "../client";
import type { SiteSettings } from "../types";

export const settingsApi = {
  get: () => apiClient.get<SiteSettings>("/settings"),

  update: (data: Partial<SiteSettings>) =>
    apiClient.put<SiteSettings>("/settings", data),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<void>("/auth/change-password", { currentPassword, newPassword }),
};
