import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
