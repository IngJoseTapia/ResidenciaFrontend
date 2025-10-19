// src/components/PasswordForm.jsx
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import "../styles/PasswordForm.css";

const PasswordForm = ({ user, changePassword }) => {
  const [formData, setFormData] = useState({
    passwordActual: "",
    nuevaPassword: "",
    confirmarPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" o "error"

  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showNuevaPassword, setShowNuevaPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Limpieza automática de mensajes
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(
      () => setMessage(""),
      messageType === "success" ? 5000 : 10000
    );
    return () => clearTimeout(timeout);
  }, [message, messageType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    if (formData.nuevaPassword !== formData.confirmarPassword) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(formData);
      setMessage(result.message);
      setMessageType(result.success ? "success" : "error");
      if (result.success) {
        setFormData({ passwordActual: "", nuevaPassword: "", confirmarPassword: "" });
      }
    } catch (err) {
      console.error(err);
      setMessage("Error al actualizar la contraseña.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="perfil-form-password" onSubmit={handleSubmit}>
      {user?.tieneContrasena && (
        <div className="password-group">
          <label>Contraseña actual</label>
          <div className="password-wrapper">
            <input
              type={showPasswordActual ? "text" : "password"}
              name="passwordActual"
              value={formData.passwordActual}
              placeholder="Ingresa tu contraseña actual"
              onChange={handleChange}
              required
            />
            <button type="button" className="toggle-password" onClick={() => setShowPasswordActual((prev) => !prev)}>
              {showPasswordActual ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      )}

      <div className="password-group">
        <label>{user?.tieneContrasena ? "Nueva contraseña" : "Contraseña"}</label>
        <div className="password-wrapper">
          <input
            type={showNuevaPassword ? "text" : "password"}
            name="nuevaPassword"
            value={formData.nuevaPassword}
            placeholder="Ingresa tu nueva contraseña"
            onChange={handleChange}
            required
          />
          <button type="button" className="toggle-password" onClick={() => setShowNuevaPassword((prev) => !prev)}>
            {showNuevaPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="password-group">
        <label>Confirma tu nueva contraseña</label>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmarPassword"
            value={formData.confirmarPassword}
            placeholder="Confirma tu nueva contraseña"
            onChange={handleChange}
            required
          />
          <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword((prev) => !prev)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {message && <div className={`form-message ${messageType}`}>{message}</div>}

      <button type="submit" className="btn-guardar" disabled={loading}>
        {loading ? (
            <span className="loading-content">
            <FaSpinner className="spinner" /> Procesando...
            </span>
        ) : user?.tieneContrasena ? "Cambiar contraseña" : "Generar contraseña"}
        </button>
    </form>
  );
};

export default PasswordForm;
