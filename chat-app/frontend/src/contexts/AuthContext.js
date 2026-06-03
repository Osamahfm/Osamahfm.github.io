import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, register as apiRegister, getMe } from "../api/endpoints";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Restore session on app start ──────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await storage.getToken();
        if (savedToken) {
          setToken(savedToken);
          const userData = await getMe();
          setUser(userData);
        }
      } catch (error) {
        console.log("Session restore failed:", error.message);
        await storage.clearAll();
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ─── Login ─────────────────────────────────────────────
  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    const { access_token } = data;
    await storage.setToken(access_token);
    setToken(access_token);

    const userData = await getMe();
    setUser(userData);
    await storage.setUser(userData);
    return userData;
  };

  // ─── Register ──────────────────────────────────────────
  const register = async (username, email, password) => {
    const userData = await apiRegister(username, email, password);
    // After register, auto-login
    await login(email, password);
    return userData;
  };

  // ─── Logout ────────────────────────────────────────────
  const logout = async () => {
    await storage.clearAll();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
