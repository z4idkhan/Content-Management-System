// ============================================================
// API SERVICE LAYER (REAL BACKEND CONNECTED - FIXED)
// ============================================================

import axios from "axios";

// 🔥 BASE API CONFIG
const api = axios.create({
  baseURL: "https://headless-cms-e1lg.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// 🔥 RESPONSE NORMALIZER (IMPORTANT)
// ============================================================

const extractData = (res: any) => {
  // handles:
  // [] OR { data: [] } OR { content: [] }
  return Array.isArray(res.data)
    ? res.data
    : res.data?.data || res.data?.content || res.data;
};

// ============================================================
// TYPES
// ============================================================

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  status: "published" | "draft";
  author: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  articleCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "disabled";
  avatar?: string;
  joinedAt: string;
}

export interface DashboardStats {
  totalArticles: number;
  published: number;
  totalUsers: number;
  viewsThisMonth: number;
}

export interface ActivityItem {
  id: string;
  message: string;
  time: string;
  user: string;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  emailNotifications: boolean;
  activityAlerts: boolean;
  twoFactor: boolean;
}

// ============================================================
// AUTH API
// ============================================================

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: "ADMIN" | "employee"
  ) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return res.data;
  },
};

// ============================================================
// ARTICLES API (FIXED)
// ============================================================

export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    const res = await api.get("/articles");
    return extractData(res);
  },

  getById: async (id: string): Promise<Article> => {
    const res = await api.get(`/articles/${id}`);
    return extractData(res);
  },

  create: async (data: any): Promise<Article> => {
    const res = await api.post("/articles", data);
    return extractData(res);
  },

  update: async (id: string, data: any): Promise<Article> => {
    const res = await api.put(`/articles/${id}`, data);
    return extractData(res);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },
};

// ============================================================
// CATEGORIES API (FIXED)
// ============================================================

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get("/categories");
    return extractData(res);
  },

  create: async (data: any): Promise<Category> => {
    const res = await api.post("/categories", data);
    return extractData(res);
  },

  update: async (id: string, data: any): Promise<Category> => {
    const res = await api.put(`/categories/${id}`, data);
    return extractData(res);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// ============================================================
// TAGS API (FIXED)
// ============================================================

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const res = await api.get("/tags");
    return extractData(res);
  },

  create: async (name: string): Promise<Tag> => {
    const res = await api.post("/tags", { name });
    return extractData(res);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};

// ============================================================
// USERS API (FIXED)
// ============================================================

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return extractData(res);
  },

  updateRole: async (id: string, role: User["role"]) => {
    const res = await api.put(`/users/${id}/role`, { role });
    return extractData(res);
  },

  toggleStatus: async (id: string) => {
    const res = await api.put(`/users/${id}/status`);
    return extractData(res);
  },

  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },
};

// ============================================================
// DASHBOARD API (FIXED)
// ============================================================

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get("/dashboard/stats");
    return extractData(res);
  },

  getRecentActivity: async (): Promise<ActivityItem[]> => {
    const res = await api.get("/dashboard/activity");
    return extractData(res);
  },
};

// ============================================================
// SETTINGS API (FIXED)
// ============================================================

export const settingsApi = {
  get: async (): Promise<SiteSettings> => {
    const res = await api.get("/settings");
    return extractData(res);
  },

  update: async (data: SiteSettings): Promise<SiteSettings> => {
    const res = await api.put("/settings", data);
    return extractData(res);
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await api.post("/settings/change-password", {
      currentPassword,
      newPassword,
    });
  },
};