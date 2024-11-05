import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuthContext";
import React from "react";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: React.ReactNode,
};
