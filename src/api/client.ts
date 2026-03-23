// ============================================================
// API Client — Central HTTP client for your headless CMS
// ============================================================
//
// HOW TO CONNECT HEADLESS CMS:
// 1. Set API_BASE_URL to your CMS API endpoint
// 2. Set your auth token retrieval logic in getAuthHeaders()
// 3. All service files use this client — no other changes needed


const BASE_URL = "https://headless-cms-e1lg.onrender.com"; 

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("cms_token");

  
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  console.log("API CALL →", url);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),  
      ...(options.headers || {}),
    },
  });


  console.log(
    "TOKEN SENT →",
    localStorage.getItem("cms_token")
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("API ERROR:", error);
    throw new Error(error.message || `API error: ${response.status}`);
  }

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