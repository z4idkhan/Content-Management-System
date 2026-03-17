// ============================================================
// API Service Layer — Headless CMS Integration Point
// ============================================================
// 
// HOW TO CONNECT YOUR HEADLESS CMS:
// 1. Replace the mock functions below with real API calls.
// 2. Set your API base URL and auth headers in the config below.
// 3. Each function maps to a CMS endpoint — update the fetch calls.
//
// For production-ready API structure, see src/api/ folder.
// ============================================================

// ─── CONFIG (Update these for your CMS) ─────────────────────
export const API_CONFIG = {
  BASE_URL: "", // e.g., "https://your-cms.com/api"
  API_TOKEN: "", // e.g., "your-api-key"
  getHeaders: () => ({
    "Content-Type": "application/json",
  }),
};

// ─── TYPES ──────────────────────────────────────────────────
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

// ─── MOCK DATA ──────────────────────────────────────────────
let mockArticles: Article[] = [
  { id: "1", title: "Getting Started with React", content: "<h2>Introduction</h2><p>React is a popular JavaScript library for building user interfaces.</p>", category: "Technology", status: "published", author: "Tanaka Yuki", views: 1250, createdAt: "2026-02-24", updatedAt: "2026-02-24" },
  { id: "2", title: "API Documentation v2", content: "<h2>API Overview</h2><p>Our API v2 introduces several improvements.</p>", category: "Documentation", status: "draft", author: "Sato Haruka", views: 0, createdAt: "2026-02-24", updatedAt: "2026-02-24" },
  { id: "3", title: "Company Update Q1 2026", content: "<h2>Q1 Highlights</h2><p>This quarter we achieved significant milestones.</p>", category: "News", status: "draft", author: "Yamamoto Ken", views: 0, createdAt: "2026-02-24", updatedAt: "2026-02-28" },
  { id: "4", title: "Design System Guidelines", content: "<h2>Design Principles</h2><p>Our design system is built on consistency and accessibility.</p>", category: "Design", status: "published", author: "Suzuki Mika", views: 890, createdAt: "2026-02-23", updatedAt: "2026-02-25" },
  { id: "5", title: "Security Best Practices", content: "<h2>Security</h2><p>Follow these best practices to keep your app secure.</p>", category: "Technology", status: "published", author: "Admin", views: 2100, createdAt: "2026-02-22", updatedAt: "2026-02-22" },
  { id: "6", title: "Onboarding Guide for New Hires", content: "<p>Welcome to the team!</p>", category: "HR", status: "published", author: "Admin", views: 430, createdAt: "2026-01-15", updatedAt: "2026-02-01" },
  { id: "7", title: "Product Roadmap 2026", content: "<p>Our product roadmap for 2026.</p>", category: "Product", status: "published", author: "Tanaka Yuki", views: 1800, createdAt: "2026-01-20", updatedAt: "2026-02-15" },
  { id: "8", title: "Engineering Blog Launch", content: "<p>We're excited to launch our engineering blog.</p>", category: "News", status: "published", author: "Sato Haruka", views: 670, createdAt: "2026-02-01", updatedAt: "2026-02-01" },
];

let mockCategories: Category[] = [
  { id: "1", name: "Technology", description: "Tech articles and tutorials", articleCount: 24, color: "#3b82f6" },
  { id: "2", name: "Documentation", description: "Product and API documentation", articleCount: 18, color: "#8b5cf6" },
  { id: "3", name: "News", description: "Company news and announcements", articleCount: 12, color: "#10b981" },
  { id: "4", name: "Design", description: "Design systems and UI guidelines", articleCount: 8, color: "#f59e0b" },
  { id: "5", name: "HR", description: "Human resources and onboarding", articleCount: 6, color: "#ef4444" },
  { id: "6", name: "Product", description: "Product updates and roadmaps", articleCount: 15, color: "#06b6d4" },
];

let mockTags: Tag[] = [
  { id: "1", name: "React", articleCount: 14 },
  { id: "2", name: "TypeScript", articleCount: 9 },
  { id: "3", name: "API", articleCount: 7 },
  { id: "4", name: "Security", articleCount: 5 },
  { id: "5", name: "UI/UX", articleCount: 8 },
  { id: "6", name: "DevOps", articleCount: 6 },
  { id: "7", name: "Docker", articleCount: 4 },
  { id: "8", name: "CI/CD", articleCount: 3 },
  { id: "9", name: "PostgreSQL", articleCount: 4 },
  { id: "10", name: "Testing", articleCount: 6 },
  { id: "11", name: "Accessibility", articleCount: 3 },
];

let mockUsers: User[] = [
  { id: "1", name: "Tanaka Yuki", email: "yuki@example.com", role: "editor", status: "active", joinedAt: "2025-08-07" },
  { id: "2", name: "Admin", email: "admin@headless.co.jp", role: "admin", status: "active", joinedAt: "2025-01-15" },
  { id: "3", name: "Sato Haruka", email: "haruka@example.com", role: "editor", status: "active", joinedAt: "2025-06-19" },
  { id: "4", name: "Yamamoto Ken", email: "ken@example.com", role: "editor", status: "active", joinedAt: "2025-09-01" },
  { id: "5", name: "Suzuki Mika", email: "mika@example.com", role: "editor", status: "active", joinedAt: "2026-01-10" },
  { id: "6", name: "User Three", email: "user3@example.com", role: "viewer", status: "active", joinedAt: "2025-10-15" },
  { id: "7", name: "User Four", email: "user4@example.com", role: "viewer", status: "disabled", joinedAt: "2025-07-22" },
  { id: "8", name: "User Five", email: "user5@example.com", role: "viewer", status: "active", joinedAt: "2025-11-30" },
  { id: "9", name: "User Six", email: "user6@example.com", role: "viewer", status: "active", joinedAt: "2026-02-13" },
];

const mockActivity: ActivityItem[] = [
  { id: "1", message: "published Getting Started with React", time: "2 min ago", user: "Tanaka Yuki" },
  { id: "2", message: "edited API Documentation v2", time: "15 min ago", user: "Sato Haruka" },
  { id: "3", message: "created Company Update Q1 2026", time: "1 hour ago", user: "Yamamoto Ken" },
  { id: "4", message: "deleted Old Draft: Test Page", time: "2 hours ago", user: "Suzuki Mika" },
  { id: "5", message: "updated role for Watanabe Ryo → Editor", time: "3 hours ago", user: "Admin" },
];

let mockSettings: SiteSettings = {
  siteName: "Headless CMS",
  siteUrl: "https://cms.headless.co.jp",
  emailNotifications: true,
  activityAlerts: true,
  twoFactor: false,
};

// ─── HELPER ─────────────────────────────────────────────────
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ─── REGISTERED USERS STORE (for login validation) ─────────
const registeredPasswords: Record<string, string> = {};

// ─── AUTH API ───────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    await delay(500);
    if (!registeredPasswords[email]) {
      throw new Error("NOT_REGISTERED");
    }
    if (registeredPasswords[email] !== password) {
      throw new Error("WRONG_PASSWORD");
    }
    const user = mockUsers.find((u) => u.email === email);
    if (!user) throw new Error("NOT_REGISTERED");
    return { user };
  },
  register: async (name: string, email: string, password: string, role: "admin" | "employee" = "employee") => {
    await delay(500);
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    if (registeredPasswords[email]) {
      throw new Error("ALREADY_REGISTERED");
    }
    registeredPasswords[email] = password;
    const newUser: User = { id: Date.now().toString(), name, email, role: role === "admin" ? "admin" : "editor", status: "active", joinedAt: new Date().toISOString().split("T")[0] };
    mockUsers.push(newUser);
    return { user: newUser };
  },
};

// ─── ARTICLES API ───────────────────────────────────────────
export const articlesApi = {
  getAll: async (): Promise<Article[]> => { await delay(); return [...mockArticles]; },
  getById: async (id: string): Promise<Article | undefined> => { await delay(); return mockArticles.find((a) => a.id === id); },
  create: async (article: Omit<Article, "id" | "createdAt" | "updatedAt" | "views">): Promise<Article> => {
    await delay();
    const newArticle: Article = { ...article, id: Date.now().toString(), views: 0, createdAt: new Date().toISOString().split("T")[0], updatedAt: new Date().toISOString().split("T")[0] };
    mockArticles.unshift(newArticle);
    return newArticle;
  },
  update: async (id: string, data: Partial<Article>): Promise<Article> => {
    await delay();
    const idx = mockArticles.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("Article not found");
    mockArticles[idx] = { ...mockArticles[idx], ...data, updatedAt: new Date().toISOString().split("T")[0] };
    return mockArticles[idx];
  },
  delete: async (id: string): Promise<void> => { await delay(); mockArticles = mockArticles.filter((a) => a.id !== id); },
};

// ─── CATEGORIES API ─────────────────────────────────────────
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => { await delay(); return [...mockCategories]; },
  create: async (cat: Omit<Category, "id" | "articleCount">): Promise<Category> => {
    await delay();
    const newCat: Category = { ...cat, id: Date.now().toString(), articleCount: 0 };
    mockCategories.push(newCat);
    return newCat;
  },
  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    await delay();
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Category not found");
    mockCategories[idx] = { ...mockCategories[idx], ...data };
    return mockCategories[idx];
  },
  delete: async (id: string): Promise<void> => { await delay(); mockCategories = mockCategories.filter((c) => c.id !== id); },
};

// ─── TAGS API ───────────────────────────────────────────────
export const tagsApi = {
  getAll: async (): Promise<Tag[]> => { await delay(); return [...mockTags]; },
  create: async (name: string): Promise<Tag> => {
    await delay();
    const newTag: Tag = { id: Date.now().toString(), name, articleCount: 0 };
    mockTags.push(newTag);
    return newTag;
  },
  delete: async (id: string): Promise<void> => { await delay(); mockTags = mockTags.filter((t) => t.id !== id); },
};

// ─── USERS API ──────────────────────────────────────────────
export const usersApi = {
  getAll: async (): Promise<User[]> => { await delay(); return [...mockUsers]; },
  updateRole: async (id: string, role: User["role"]): Promise<User> => {
    await delay();
    const idx = mockUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    mockUsers[idx] = { ...mockUsers[idx], role };
    return mockUsers[idx];
  },
  toggleStatus: async (id: string): Promise<User> => {
    await delay();
    const idx = mockUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    mockUsers[idx] = { ...mockUsers[idx], status: mockUsers[idx].status === "active" ? "disabled" : "active" };
    return mockUsers[idx];
  },
  delete: async (id: string): Promise<void> => { await delay(); mockUsers = mockUsers.filter((u) => u.id !== id); },
};

// ─── DASHBOARD API ──────────────────────────────────────────
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => { await delay(); return { totalArticles: 128, published: 96, totalUsers: 24, viewsThisMonth: 14200 }; },
  getRecentActivity: async (): Promise<ActivityItem[]> => { await delay(); return [...mockActivity]; },
};

// ─── SETTINGS API ───────────────────────────────────────────
export const settingsApi = {
  get: async (): Promise<SiteSettings> => { await delay(); return { ...mockSettings }; },
  update: async (data: Partial<SiteSettings>): Promise<SiteSettings> => { await delay(); mockSettings = { ...mockSettings, ...data }; return { ...mockSettings }; },
  changePassword: async (_current: string, _newPass: string): Promise<void> => { await delay(500); },
};
