// src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 🔹 importamos useNavigate
import "../styles/ForgotPassword.css";
import logoINE from "../assets/btnIFE.png";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 🔹 inicializamos useNavigate

  useEffect(() => {
    // 🔹 si hay éxito, redirige después de 5 segundos
    if (success) {
      const timer = setTimeout(() => navigate("/"), 5000);
      return () => clearTimeout(timer); // limpiar el timeout si se desmonta
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess(data.mensaje || "Se ha enviado un correo con instrucciones para restablecer tu contraseña");
      } else {
        setError(data.mensaje || "Error al solicitar recuperación de contraseña");
      }

    } catch (err) {
      setLoading(false);
      setError("Error en la conexión con el servidor: " + err);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        {/* Lado izquierdo */}
        <div className="forgot-left">
          <img src={logoINE} alt="Logo INE" className="forgot-logo" />
          <h3 className="forgot-slogan">09 Junta Distrital Ejecutiva INE</h3>
          <h3 className="forgot-slogan">Informes de actividades CAE y SE</h3>
        </div>

        {/* Lado derecho */}
        <div className="forgot-right">
          <h2>Recuperar contraseña</h2>
          <h3 className="forgot-subtitle">Ingresa tu correo electrónico para restablecer tu contraseña</h3>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="forgot-btn" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>

          <div className="bottom-text">
            <Link to="/">Regresar al inicio de sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
