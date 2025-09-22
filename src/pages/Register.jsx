// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Register.css";
import logoINE from "../assets/btnIFE.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    telefono: "",
    genero: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // 🔹 Validación local de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return; // Salir antes de enviar al backend
    }

    // Opcional: validar patrón de contraseña localmente
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!regex.test(formData.password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)"
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess(data.message); // ✅ Solo el mensaje
        setTimeout(() => navigate("/"), 5000);
      } else {
        setError(data?.message || "Error en el registro"); // 🔹 también usa message aquí
      }
    } catch (err) {
      setLoading(false);
      setError(
        "Error al conectarse con el servidor. Por favor intenta nuevamente."
      );
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Lado izquierdo con logo y frase */}
        <div className="register-left">
          <img src={logoINE} alt="Logo INE" className="login-logo" />
          <h3 className="login-slogan">09 Junta Distrital Ejecutiva INE</h3>
          <h3 className="login-slogan">Informes de actividades CAE y SE</h3>
        </div>

        {/* Lado derecho con formulario */}
        <div className="register-right">
          <h2>Registro de usuario</h2>
          <h3 className="register-subtitle">Completa tus datos para crear una cuenta</h3>

          <form onSubmit={handleSubmit}>
            <h4 className="register-datos">Ingresa tu nombre</h4>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <h4 className="register-datos">Ingresa tu apellido paterno</h4>
            <input
              type="text"
              name="apellidoPaterno"
              placeholder="Apellido Paterno"
              value={formData.apellidoPaterno}
              onChange={handleChange}
              required
            />
            <h4 className="register-datos">Ingresa tu apellido materno</h4>
            <input
              type="text"
              name="apellidoMaterno"
              placeholder="Apellido Materno"
              value={formData.apellidoMaterno}
              onChange={handleChange}
              required
            />
            <h4 className="register-datos">Ingresa tu correo electrónico</h4>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <h4 className="register-datos">Ingresa tu número de teléfono</h4>
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
            <h4 className="register-datos">Selecciona tu género</h4>
            <select name="genero" value={formData.genero} onChange={handleChange} required>
              <option value="">Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            <h4 className="register-datos">Genera una contraseña: debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial</h4>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <h4 className="register-datos">Confirma tu contraseña</h4>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
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

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>

          <div className="bottom-text">
            ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
