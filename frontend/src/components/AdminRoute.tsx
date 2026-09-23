import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Koristi se unutar ProtectedRoute, pa je korisnik ovde vec prijavljen.
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
