// src/routes/ProtectedRoute.jsx
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const PUBLIC_ROUTES = [
  "/", 
  "/register",
  "/forgot-password",
  "/verify-reset-token",
  "/reset-password",
];

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Cargando...</p>;

  // 🔸 Si es una ruta pública, no hay restricción
  if (PUBLIC_ROUTES.includes(location.pathname)) return children;

  // 🔸 Detectar logout intencional
  const justLoggedOut = sessionStorage.getItem("justLoggedOut") === "1";

  if (justLoggedOut) {
    // borrar la marca inmediatamente
    sessionStorage.removeItem("justLoggedOut");
    return <Navigate to="/" replace />;
  }

  // 🔸 Usuario no logeado (sin logout intencional)
  if (!user) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname, fallback: "/" }}
      />
    );
  }

  // 🔸 Usuario logeado, pero sin rol permitido
  if (role && user.role !== role) {
    const fallbackDashboard =
      user.role === "ADMIN" ? "/admin/dashboard" :
      user.role === "VOCAL" ? "/vocal/dashboard" :
      "/user/dashboard";

    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname, fallback: fallbackDashboard }}
      />
    );
  }

  // 🔸 Usuario válido
  return children;
};

export default ProtectedRoute;
