// ============================================================
// API SERVICE LAYER (CLEAN + FIXED MOCK VERSION)
// ============================================================

import axios from "axios";

// Optional (for future backend switch)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// TYPES (FIXED — NO RECURSION)
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
// MOCK HELPERS
// ============================================================

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ============================================================
// MOCK DATA
// ============================================================

let mockArticles: Article[] = [
  {
    id: "1",
    title: "Getting Started with React",
    content: "<h2>Intro</h2><p>React is a UI library.</p>",
    category: "Technology",
    status: "published",
    author: "Admin",
    views: 1200,
    createdAt: "2026-02-24",
    updatedAt: "2026-02-24",
  },
];

let mockCategories: Category[] = [
  {
    id: "1",
    name: "Technology",
    description: "Tech articles",
    articleCount: 10,
    color: "#3b82f6",
  },
];

// ============================================================
// AUTH API
// ============================================================

const users: User[] = [];
const passwords: Record<string, string> = {};

export const authApi = {
  login: async (email: string, password: string) => {
    await delay(500);

    if (!passwords[email]) throw new Error("NOT_REGISTERED");
    if (passwords[email] !== password) throw new Error("WRONG_PASSWORD");

    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("NOT_REGISTERED");

    return { user };
  },

  register: async (
    name: string,
    email: string,
    password: string
  ) => {
    await delay(500);

    if (passwords[email]) throw new Error("ALREADY_REGISTERED");

    passwords[email] = password;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: "editor",
      status: "active",
      joinedAt: new Date().toISOString(),
    };

    users.push(newUser);
    return { user: newUser };
  },
};

// ============================================================
// ARTICLES API (CRUD)
// ============================================================

export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    await delay();
    return [...mockArticles];
  },

  getById: async (id: string): Promise<Article | undefined> => {
    await delay();
    return mockArticles.find((a) => a.id === id);
  },

  create: async (
    data: Omit<Article, "id" | "views" | "createdAt" | "updatedAt">
  ): Promise<Article> => {
    await delay();

    const newArticle: Article = {
      ...data,
      id: Date.now().toString(),
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockArticles.unshift(newArticle);
    return newArticle;
  },

  update: async (
    id: string,
    data: Partial<Article>
  ): Promise<Article> => {
    await delay();

    const index = mockArticles.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Article not found");

    mockArticles[index] = {
      ...mockArticles[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockArticles[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    mockArticles = mockArticles.filter((a) => a.id !== id);
  },
};

// ============================================================
// CATEGORIES API (CRUD)
// ============================================================

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    await delay();
    return [...mockCategories];
  },

  create: async (
    data: Omit<Category, "id" | "articleCount">
  ): Promise<Category> => {
    await delay();

    const newCategory: Category = {
      ...data,
      id: Date.now().toString(),
      articleCount: 0,
    };

    mockCategories.push(newCategory);
    return newCategory;
  },

  update: async (
    id: string,
    data: Partial<Category>
  ): Promise<Category> => {
    await delay();

    const index = mockCategories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");

    mockCategories[index] = {
      ...mockCategories[index],
      ...data,
    };

    return mockCategories[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    mockCategories = mockCategories.filter((c) => c.id !== id);
  },
};

// ============================================================
// TAGS API
// ============================================================

let mockTags: Tag[] = [];

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    await delay();
    return [...mockTags];
  },

  create: async (name: string): Promise<Tag> => {
    await delay();

    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      articleCount: 0,
    };

    mockTags.push(newTag);
    return newTag;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    mockTags = mockTags.filter((t) => t.id !== id);
  },
};

// ============================================================
// USERS API
// ============================================================

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    await delay();
    return [...users];
  },

  updateRole: async (id: string, role: User["role"]) => {
    await delay();

    const user = users.find((u) => u.id === id);
    if (!user) throw new Error("User not found");

    user.role = role;
    return user;
  },

  toggleStatus: async (id: string) => {
    await delay();

    const user = users.find((u) => u.id === id);
    if (!user) throw new Error("User not found");

    user.status = user.status === "active" ? "disabled" : "active";
    return user;
  },

  delete: async (id: string) => {
    await delay();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) users.splice(index, 1);
  },
};

// ============================================================
// ✅ DASHBOARD API (ADDED FIX)
// ============================================================

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delay();

    return {
      totalArticles: mockArticles.length,
      published: mockArticles.filter((a) => a.status === "published").length,
      totalUsers: users.length,
      viewsThisMonth: mockArticles.reduce((sum, a) => sum + a.views, 0),
    };
  },

  getRecentActivity: async (): Promise<ActivityItem[]> => {
    await delay();

    return [
      {
        id: "1",
        user: "Admin",
        message: "published an article",
        time: "2 min ago",
      },
      {
        id: "2",
        user: "Editor",
        message: "updated a category",
        time: "10 min ago",
      },
    ];
  },
};

// ============================================================
// SETTINGS API (ADD THIS)
// ============================================================

let mockSettings: SiteSettings = {
  siteName: "My CMS",
  siteUrl: "http://localhost:5173",
  emailNotifications: true,
  activityAlerts: true,
  twoFactor: false,
};

export const settingsApi = {
  get: async (): Promise<SiteSettings> => {
    await delay();
    return { ...mockSettings };
  },

  update: async (data: SiteSettings): Promise<SiteSettings> => {
    await delay();
    mockSettings = { ...data };
    return mockSettings;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await delay();

    // mock validation
    if (currentPassword !== "admin123") {
      throw new Error("Incorrect current password");
    }

    // pretend password changed
    return;
  },
};
