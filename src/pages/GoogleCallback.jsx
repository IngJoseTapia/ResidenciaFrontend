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

    // Manejo de error de OAuth
    if (error) {
      loginWithGoogle({ error });
    } 
    // Inicio de sesión exitoso
    else if (token && refreshToken) {
      loginWithGoogle({ token, refreshToken });
    }

    // Redirigimos al login y dejamos que el useEffect en Login.jsx gestione la ruta según rol
    navigate("/login", { replace: true });
  }, [navigate, loginWithGoogle]);

  return <p>Procesando inicio de sesión con Google...</p>;
}
