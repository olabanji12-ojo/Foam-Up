import React, { createContext, useContext, useEffect, useState } from "react";
import { baseURL } from "../utils/environments";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // optional if using cookie
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        console.log("AuthContext initializing...");
        console.log("Stored user:", storedUser);
        console.log("Stored token:", storedToken ? "present" : "missing");

        if (storedUser && storedToken) {
          // ✅ Case 1: JWT-based auth
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        } 
        
        else if (storedToken) {
          // ✅ Case 2: token exists but user not stored → fetch
          const res = await fetch(`${baseURL}/user/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          const data = await res.json();
          if (data.success && data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } 
        
        else {
          // ✅ Case 3: no token → try cookie-based auth
          const res = await fetch(`${baseURL}/user/me`, {
            credentials: "include", // send cookies
          });
          const data = await res.json();
          if (data.success && data.data?.user) {
            const user = data.data.user;
            setUser(user);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token = null) => {
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token"); // cookie mode
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
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
