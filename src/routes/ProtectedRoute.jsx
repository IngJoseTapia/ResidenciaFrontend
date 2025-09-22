// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // IMPORTANTE: importar el hook separado

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth(); // Obtenemos user desde el contexto

  // Si no hay usuario logueado, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifica un rol y el usuario no lo cumple, redirige a unauthorized
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo está bien, renderiza los hijos
  return children;
};

export default ProtectedRoute;
