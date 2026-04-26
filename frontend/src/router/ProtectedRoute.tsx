import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
