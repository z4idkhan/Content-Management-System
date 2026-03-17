// ============================================================
// API Client — Central HTTP client for your headless CMS
// ============================================================
//
// HOW TO CONNECT YOUR HEADLESS CMS:
// 1. Set API_BASE_URL to your CMS API endpoint
// 2. Set your auth token retrieval logic in getAuthHeaders()
// 3. All service files use this client — no other changes needed
//
// Example:
//   const API_BASE_URL = "https://your-cms-api.com/api";
// ============================================================

const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  "https://headless-cms-e1lg.onrender.com";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("cms_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: "DELETE",
    }),
};
