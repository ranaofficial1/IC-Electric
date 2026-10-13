import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken as persistToken, clearToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while the initial /auth/me check runs

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        if (!cancelled) setUser(res.data);
      } catch {
        // Token missing/expired/invalid — treat as logged out.
        clearToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function register({ name, email, password, phone }) {
    const res = await api.post("/auth/register", { name, email, password, phone }, { auth: false });
    persistToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password }, { auth: false });
    persistToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Stateless JWT — nothing meaningful can fail server-side here, but
      // don't let a network hiccup stop the client from logging out.
    }
    clearToken();
    setUser(null);
  }

  async function updateProfile({ name, phone }) {
    const res = await api.put("/customers/me", { name, phone });
    setUser(res.data);
    return res.data;
  }

  async function changePassword(currentPassword, newPassword) {
    return api.post("/auth/change-password", { currentPassword, newPassword });
  }

  async function forgotPassword(email) {
    return api.post("/auth/forgot-password", { email }, { auth: false });
  }

  async function resetPassword(token, newPassword) {
    return api.post("/auth/reset-password", { token, newPassword }, { auth: false });
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
