import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the child components
  return <Outlet />;
};

export default ProtectedRoute;
