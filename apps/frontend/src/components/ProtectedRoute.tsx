import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Context'; // Adjust import path as needed

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Still loading - show loading indicator
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated - render children
  return <>{children}</>;
};

export default ProtectedRoute;