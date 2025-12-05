import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, token } = useAuth();
  const location = useLocation();

  if (loading) return null; // or <div>Loading...</div>

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}
