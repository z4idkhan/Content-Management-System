import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean; // ✅ FIXED (was isLoading)
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "admin" | "employee"
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      console.error("Failed to parse stored user:", err);
      localStorage.removeItem("cms_user");
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // LOGIN (FIXED)
  // =========================
  const login = async (email: string, password: string) => {
  try {
    setLoading(true);

    const res = await authApi.login(email, password);

    let userData: User;

    if ("user" in res) {
      userData = res.user;
    } else {
      userData = res;
    }

    setUser(userData);
    localStorage.setItem("cms_user", JSON.stringify(userData));
  } catch (err: any) {
    console.error(err);

    throw new Error(
      err?.response?.data?.message ||
      err?.message ||
      "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  // =========================
  // REGISTER
  // =========================
  const register = async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "employee"
  ) => {
    try {
      await authApi.register(name, email, password, role);
    } catch (err: any) {
      console.error(err);

      throw new Error(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("cms_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
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