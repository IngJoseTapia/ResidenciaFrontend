// src/pages/Unauthorized.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Unauthorized.css";  // ya no necesitas importar Dashboard.css

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fallback = location.state?.fallback || "/";
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    if (counter === 0) {
      navigate(fallback, { replace: true });
      return;
    }
    const timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter, navigate, fallback]);

  const handleReturn = () => navigate(fallback, { replace: true });

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <h1 className="unauthorized-title">🚫 Acceso Denegado</h1>

        <p className="unauthorized-text">
          No tienes permisos para acceder a esta ruta o recurso.
        </p>

        <p className="unauthorized-muted">
          Serás redirigido automáticamente en{" "}
          <strong className="unauthorized-count">{counter} segundos</strong>.<br />
          Si prefieres, puedes volver manualmente.
        </p>

        <button
          className="unauthorized-btn"
          onClick={handleReturn}
          aria-label="Volver a la página anterior"
        >
          ← Volver a la página anterior
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
