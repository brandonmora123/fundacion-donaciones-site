import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />; // Esto permite renderizar todas las rutas hijas
};

export default ProtectedRoute;
