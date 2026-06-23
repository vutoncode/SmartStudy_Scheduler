import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#070a13] gap-4">
        <LoadingSpinner size="lg" color="primary" />
        <span className="text-sm text-muted">Đang tải cấu hình học viên...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
