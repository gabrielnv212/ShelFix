import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requireAdmin = false, requireCompany = false }) => {
  const { isAuthenticated, isAdmin, isCompany } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireCompany && !isCompany) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
