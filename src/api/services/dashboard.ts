// ============================================================
// Dashboard API service
// TODO: Update endpoints to match your headless CMS routes.
// ============================================================

import { apiClient } from "../client";
import type { DashboardStats, ActivityItem } from "../types";

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>("/dashboard/stats"),

  getRecentActivity: () => apiClient.get<ActivityItem[]>("/dashboard/activity"),
};
