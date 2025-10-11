// src/pages/GoogleCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function GoogleCallback() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (error) {
      // Si hay error, lo pasamos directamente al contexto
      loginWithGoogle({ error });
      navigate("/login", { replace: true });
    } else if (token && refreshToken) {
      loginWithGoogle({ token, refreshToken });
      navigate("/user/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, loginWithGoogle]);

  return <p>Procesando inicio de sesión con Google...</p>;
}
