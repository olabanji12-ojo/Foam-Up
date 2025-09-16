import React, { createContext, useContext, useEffect, useState } from 'react';
import { baseURL } from '../utils/environments';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("🔄 Checking auth status with cookie...");
        
        const res = await fetch(`${baseURL}/user/me`, {
          method: "GET",
          credentials: "include", // 🔑 VERY IMPORTANT to send cookies
        });

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const data = await res.json();
        console.log("✅ User loaded:", data.user);

        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.warn("Auth check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${baseURL}/user/logout`, {
        method: "POST",
        credentials: "include", // send cookie so backend can clear it
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
