import React from 'react';
import { Navigate, useLocation } from 'react-router';
import UseAuth from '../Hooks/UseAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = UseAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default PrivateRoute;
