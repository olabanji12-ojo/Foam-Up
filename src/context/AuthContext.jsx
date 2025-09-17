import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axiosConfiguration/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Check if token exists on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        console.log("🔄 Checking auth status with token...");

        const res = await axiosClient.get("/user/me"); // protected route
        console.log("✅ User loaded:", res.data.user);

        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.warn("Auth check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 🔑 Normal login (email + password)
  const login = async (email, password) => {
    const res = await axiosClient.post("/user/login", { email, password });
    const { token, user } = res.data.data;

    localStorage.setItem("token", token);
    setUser(user);
    setIsAuthenticated(true);
  };

  // 🔑 Callback login (already have token + user)
  const callbackLogin = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    callbackLogin, // expose callback login
    logout,
    setUser,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
