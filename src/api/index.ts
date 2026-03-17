// ============================================================
// Barrel export — import everything from "@/api"
// ============================================================
//
// HOW TO SWITCH FROM MOCK DATA TO REAL API:
// 1. Set your API base URL in src/api/client.ts
// 2. Update endpoint paths in each service file if needed
// 3. In your components, change imports from "@/lib/api" to "@/api"
//    Example: import { articlesApi, type Article } from "@/api";
// 4. Delete src/lib/api.ts when no longer needed
// ============================================================

export { apiClient } from "./client";
export { articlesApi } from "./services/articles";
export { categoriesApi } from "./services/categories";
export { tagsApi } from "./services/tags";
export { usersApi } from "./services/users";
export { authApi } from "./services/auth";
export { settingsApi } from "./services/settings";
export { dashboardApi } from "./services/dashboard";
export type * from "./types";
