// ============================================================
// Shared types for the Headless CMS API (FIXED)
// ============================================================

export interface Article {
  id: number | string;
  title: string;
  content: string;
  category: string;
  status: "published" | "draft";
  author: string;
  views: number;
  date: string;
}

export interface Category {
  id: number | string;
  name: string;
  description: string;
  articleCount: number;
  color: string;
}

export interface TagItem {
  id: number | string;
  name: string;
  slug: string;
  articleCount: number;
}

// ✅ FIXED USER TYPE
export interface User {
  id: number | string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE"; // 🔥 stricter typing
  status: "active" | "disabled";
  joined: string; // ✅ matches your AuthContext fix
}

// ============================================================
// AUTH TYPES
// ============================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

// ✅ FIXED: added role (required by backend)
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "EMPLOYEE"; // 🔥 REQUIRED FIX
}

// ✅ FIXED: backend only returns token
export interface AuthResponse {
  token: string;
  // ❌ REMOVED user (backend doesn’t send it)
}

// ============================================================
// SETTINGS
// ============================================================

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  emailNotifications: boolean;
  activityAlerts: boolean;
  twoFactor: boolean;
  darkMode: boolean;
}

// ============================================================
// DASHBOARD
// ============================================================

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
}