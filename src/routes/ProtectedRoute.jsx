// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, rol }) => {
  const { user, loading } = useAuth();

  // 🔹 Esperar a que se cargue el user
  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (rol && user.role !== rol) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
