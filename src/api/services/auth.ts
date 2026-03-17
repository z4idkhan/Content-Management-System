// ============================================================
// Auth API service
// TODO: Update endpoints to match your headless CMS auth routes.
// ============================================================

import { apiClient } from "../client";
import type { AuthResponse, LoginCredentials, RegisterData } from "../types";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>("/auth/login", credentials),

  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  logout: () => apiClient.post<void>("/auth/logout", {}),

  me: () => apiClient.get<AuthResponse["user"]>("/auth/me"),
};
