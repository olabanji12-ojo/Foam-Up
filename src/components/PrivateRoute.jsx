// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;


