import React, { createContext, useContext, useEffect, useState } from 'react';
import {baseURL} from '../utils/environments';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => { 
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        console.log('AuthContext initializing...');
        console.log('Stored user:', storedUser);
        console.log('Stored token:', storedToken ? 'present' : 'missing');

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Setting user and auth:', parsedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        } 
        
        else if (storedToken) {
          fetch(`${baseURL}/user/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
            .then(res => res.json())
            .then(data => {
              localStorage.setItem("user", JSON.stringify(data.user));
              setUser(data.user);
              setToken(storedToken);
              setIsAuthenticated(true);
            })
            .catch(err => {
              console.error("Failed to fetch user:", err);
              localStorage.removeItem("token");
              logout();
            });
        }
        
         else {
          console.log('No user or token in localStorage, clearing...');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        console.log('AuthContext initialization complete, state:', {
          loading: false,
          isAuthenticated,
          user: user ? user.id : null,
          token: token ? 'present' : 'missing',
        });
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  }; 

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};