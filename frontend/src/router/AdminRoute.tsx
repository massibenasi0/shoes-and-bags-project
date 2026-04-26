import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface Props {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<Props> = ({ children }) => {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
};
