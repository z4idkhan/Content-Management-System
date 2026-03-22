import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { authApi } from "@/api/services/auth";
import type { User } from "@/api/types"; // adjust if needed

// =========================
// TYPES
// =========================
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "ADMIN" | "EMPLOYEE"
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =========================
// PROVIDER
// =========================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // LOAD USER FROM STORAGE
  // =========================
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cms_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem("cms_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================
  // LOGIN (FIXED)
  // =========================
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // ✅ backend expects object
      const res = await authApi.login({ email, password });

      // ✅ backend returns { token }
      if (!res?.token) {
        throw new Error("Invalid response from server");
      }

      // ✅ store token
      localStorage.setItem("cms_token", res.token);

      // 🔥 OPTIONAL: create dummy user (since backend doesn't return user)
      const userData: User = {
        id: "1",
        name: email.split("@")[0],
        email,
        role: "ADMIN",
        status: "active",
        joined: new Date().toISOString(),
      };

      setUser(userData);
      localStorage.setItem("cms_user", JSON.stringify(userData));
    } catch (err: any) {
      console.error(err);
      throw new Error(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // REGISTER (FIXED)
  // =========================
  const register = async (
    name: string,
    email: string,
    password: string,
    role: "ADMIN" | "EMPLOYEE"
  ) => {
    try {
      // ✅ backend expects full user object
      await authApi.register({
        name,
        email,
        password,
        role,
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err?.message || "Registration failed");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("cms_user");
    localStorage.removeItem("cms_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// HOOK
// =========================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};