// src/pages/login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import logoINE from "../assets/btnIFE.png";
import "../styles/Login.css";

const ROLE_PATHS = {
  ADMIN: "/admin/dashboard",
  VOCAL: "/vocal/dashboard",
  USER: "/user/dashboard",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, user, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      const userRole = user.role?.toUpperCase() || "USER";
      navigate(ROLE_PATHS[userRole] || "/user/dashboard");
    }
  }, [user, navigate]);

  // 🔹 Limpiar el mensaje de error automáticamente después de 5 segundos
  useEffect(() => {
    if (!authError) return;

    const timer = setTimeout(() => {
      setAuthError("");
    }, 5000); // 5000ms = 5 segundos

    return () => clearTimeout(timer); // limpieza
  }, [authError, setAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await login(email, password); // ya no guardamos en result
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Lado izquierdo: Logo y frase */}
        <div className="login-left">
          <img src={logoINE} alt="Logo INE" className="login-logo" />
          <h3 className="login-slogan">09 Junta Distrital Ejecutiva INE</h3>
          <h3 className="login-slogan">Informes de actividades CAE y SE</h3>
        </div>

        {/* Lado derecho: Formulario */}
        <div className="login-right">
          <h2>Iniciar Sesión</h2>
          <h3 className="login-subtitle">Ingresa tus credenciales para acceder a tu cuenta</h3>

          <form onSubmit={handleSubmit} style={{ position: "relative" }}>
            {/* Email */}
            <h4 className="login-correo">Correo Electrónico</h4>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@tucorreo.com"
              />
            </div>

            {/* Contraseña */}
            <h4 className="login-correo">Contraseña</h4>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            </div>

            {/* 🔹 Mostrar error directamente desde authError */}
            {authError && <div className="error-message">{authError}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <h4 className="login-services">O CONTINÚA CON</h4>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <FcGoogle size={20} />
            Google
          </button>

          <div className="bottom-text">
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
