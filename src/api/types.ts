// ============================================================
// Shared types for the Headless CMS API
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

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  status: "active" | "disabled";
  joined: string;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  emailNotifications: boolean;
  activityAlerts: boolean;
  twoFactor: boolean;
  darkMode: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
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
}
