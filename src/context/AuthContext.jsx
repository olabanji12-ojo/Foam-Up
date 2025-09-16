import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../axiosConfiguration/axiosClient';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("🔄 Checking auth status with cookie...");

        // ✅ axios automatically includes cookies because axiosClient has withCredentials
        const res = await axiosClient.get("/user/me");

        console.log("✅ User loaded:", res.data.user);
        setUser(res.data.user);
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
      await axiosClient.post("/user/logout"); // ✅ clears cookie on backend
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
