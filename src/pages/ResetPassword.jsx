// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";
import logoINE from "../assets/btnIFE.png";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true); // 🔹 controla si el token es válido
  // 🔹 Estados para mostrar/ocultar contraseña
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Si no hay token, redirigir al login
    if (!token) {
      setTokenValid(false);
      setError("Token no proporcionado. No puedes acceder a esta página.");
      return;
    }

    // 🔹 Limpiar el token de la URL para estética
    window.history.replaceState({}, document.title, "/reset-password");
  }, [token]);

  useEffect(() => {
  // 🔹 Redirección automática si token inválido
    if (!tokenValid) {
        const timer = setTimeout(() => navigate("/"), 3000);
        return () => clearTimeout(timer);
    }
    }, [tokenValid, navigate]);

  // 🔹 Validación frontend de contraseña
  const isPasswordValid = (password) => {
    // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (cualquiera)
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess(
          data.mensaje || "Contraseña actualizada correctamente. Ahora puedes iniciar sesión."
        );
        setTimeout(() => navigate("/"), 5000);
      } else {
        // 🔹 Si el backend indica token inválido, deshabilitar formulario
        if (data.mensaje?.toLowerCase().includes("token")) {
          setTokenValid(false);
        }
        setError(data.mensaje || "No se pudo actualizar la contraseña");
      }
    } catch (err) {
      setLoading(false);
      setError("Error en la conexión con el servidor: " + err);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        {/* Lado izquierdo */}
        <div className="reset-left">
          <img src={logoINE} alt="Logo INE" className="reset-logo" />
          <h3 className="reset-slogan">09 Junta Distrital Ejecutiva INE</h3>
          <h3 className="reset-slogan">Informes de actividades CAE y SE</h3>
        </div>

        {/* Lado derecho */}
        <div className="reset-right">
          <h2>Restablecer contraseña</h2>
          <h3 className="reset-subtitle">
            Ingresa tu nueva contraseña, debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
          </h3>

          {tokenValid ? (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>

                <div className="input-group">
                <FaLock className="input-icon" />
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <button type="submit" className="reset-btn" disabled={loading}>
                {loading ? "Guardando..." : "Actualizar contraseña"}
              </button>
            </form>

            
          ) : (
            <div className="error-message">
              {error || "No puedes acceder a esta página sin un token válido."}
              <br />
            </div>
          )}

            <div className="bottom-text">
                <Link to="/">Regresar al inicio de sesión</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
