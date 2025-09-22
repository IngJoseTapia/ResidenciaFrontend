// src/pages/VerifyResetToken.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyResetToken = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/verify-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess(data.mensaje || "Token verificado. Redirigiendo...");
        // Guardamos token en memoria temporal y redirigimos
        setTimeout(() => navigate(`/reset-password?token=${token}`), 1500);
      } else {
        setError(data.mensaje || "Token inválido o expirado");
      }
    } catch (err) {
      setLoading(false);
      setError("Error de conexión con el servidor" + err);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="forgot-right">
          <h2>Verificar código</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Introduce el código recibido"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" disabled={loading}>
              {loading ? "Verificando..." : "Verificar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetToken;
