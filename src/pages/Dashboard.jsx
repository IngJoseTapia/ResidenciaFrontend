import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaHome, FaUniversity, FaBook, FaFacebook, FaInstagram, FaGlobe, FaYoutube } from "react-icons/fa";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { logout } = useAuth();
  const { user, loadUserInfo } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bienvenida");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  // Mensajes para Mi Información
  const [infoMessage, setInfoMessage] = useState("");
  const [infoMessageType, setInfoMessageType] = useState(""); // "success" | "error"

  // Mensajes para Seguridad (contraseña)
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityMessageType, setSecurityMessageType] = useState("");

  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showNuevaPassword, setShowNuevaPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      await loadUserInfo();
      setLoading(false);
    };
    fetchUser();
  }, [loadUserInfo]);

  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    genero: "",
  });

  const [passwordData, setPasswordData] = useState({
    passwordActual: "",
    nuevaPassword: "",
    confirmarPassword: "",
  });

  // Sincronizar cada vez que cambie user
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellidoPaterno: user.apellidoPaterno || "",
        apellidoMaterno: user.apellidoMaterno || "",
        correo: user.correo || "",
        telefono: user.telefono || "",
        genero: user.genero || "",
      });
    }
  }, [user]);

  // Efecto para mensajes de información (perfil)
  useEffect(() => {
    if (infoMessage) {
      const timeout = setTimeout(() => {
        setInfoMessage("");
        setInfoMessageType("");
      }, infoMessageType === "error" ? 10000 : 5000); // 10s error, 5s éxito

      return () => clearTimeout(timeout);
    }
  }, [infoMessage, infoMessageType]);

  // Efecto para mensajes de seguridad (contraseña)
  useEffect(() => {
    if (securityMessage) {
      const timeout = setTimeout(() => {
        setSecurityMessage("");
        setSecurityMessageType("");
      }, securityMessageType === "error" ? 10000 : 5000);

      return () => clearTimeout(timeout);
    }
  }, [securityMessage, securityMessageType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const { nombre, apellidoPaterno, apellidoMaterno, telefono, genero } = formData;

      const response = await fetch("http://localhost:8080/user/info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ nombre, apellidoPaterno, apellidoMaterno, telefono, genero }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || "Error al actualizar");

      setInfoMessage(data.mensaje || "Información actualizada con éxito ✅");
      setInfoMessageType("success");

      await loadUserInfo();
    } catch (error) {
      setInfoMessage(error.message || "No se pudo actualizar la información ❌");
      setInfoMessageType("error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true); // Deshabilitar el botón inmediatamente
    try {
      const { passwordActual, nuevaPassword, confirmarPassword } = passwordData;

      const response = await fetch("http://localhost:8080/user/info/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ passwordActual, nuevaPassword, confirmarPassword }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje || "Error al cambiar contraseña");

      setSecurityMessage(data.mensaje || "Contraseña actualizada con éxito ✅");
      setSecurityMessageType("success");

      setPasswordData({ passwordActual: "", nuevaPassword: "", confirmarPassword: "" });
    } catch (error) {
      setSecurityMessage(error.message || "No se pudo actualizar la contraseña ❌");
      setSecurityMessageType("error");
    } finally {
      setLoadingPassword(false); // Volver a habilitar el botón
    }
  };

  if (loading) return <p>Cargando información del usuario...</p>;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <button onClick={toggleSidebar} className="hamburger-btn"><FaBars /></button>
        </div>
        <nav className="sidebar-menu">
          <button
            onClick={() => setActiveTab("bienvenida")}
            className={activeTab === "bienvenida" ? "menu-item active" : "menu-item"}
          >
            <FaHome className={sidebarOpen ? "icon-normal" : "icon-large"} /> 
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("perfil")}
            className={activeTab === "perfil" ? "menu-item active" : "menu-item"}
          >
            <FaUser className={sidebarOpen ? "icon-normal" : "icon-large"} /> 
            <span>Mi Información</span>
          </button>

          <button
            onClick={() => setActiveTab("tutorial")}
            className={activeTab === "tutorial" ? "menu-item active" : "menu-item"}
          >
            <FaBook className={sidebarOpen ? "icon-normal" : "icon-large"} /> 
            <span>Cómo usar</span>
          </button>

          <button
            onClick={() => setActiveTab("institucion")}
            className={activeTab === "institucion" ? "menu-item active" : "menu-item"}
          >
            <FaUniversity className={sidebarOpen ? "icon-normal" : "icon-large"} /> 
            <span>09 Junta Distrital Ejecutiva</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt className={sidebarOpen ? "icon-normal" : "icon-large"} /> 
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <header className="topbar">
          <div className="left-section">
            <h2>Bienvenido, {user?.nombre}</h2>
          </div>
          <div className="right-section">
            <button onClick={() => setShowNotifications(true)} className="icon-btn"><FaBell /></button>
            <button onClick={() => setActiveTab("perfil")} className="icon-btn"><FaUser /></button>
            <button onClick={handleLogout} className="icon-btn"><FaSignOutAlt /></button>
          </div>
        </header>

        {/* Contenido dinámico */}
        <div className="dashboard-cards">
          <section className="dashboard-content">
            {activeTab === "bienvenida" && (
              <div className="bienvenida-container">
                <h2 className="bienvenida-title">🌐 Bienvenido al Sistema de Gestión de Informes de Actividades</h2>
                <p className="bienvenida-subtitle">
                  Este sistema ha sido diseñado para optimizar y digitalizar el proceso de elaboración, envío y revisión de informes del personal de honorarios que colabora en la <b>09 Junta Distrital del INE</b>.
                </p>

                <div className="bienvenida-grid">
                  <div className="card">
                    <h3>📋 Bitácora de actividades</h3>
                    <p>Registra tus actividades diarias de forma simple y organizada.</p>
                  </div>
                  <div className="card">
                    <h3>📝 Elaboración de informes</h3>
                    <p>Crea y envía tus informes digitales sin necesidad de papel ni impresiones.</p>
                  </div>
                  <div className="card">
                    <h3>✅ Revisión y validación</h3>
                    <p>Recibe retroalimentación y validación de manera ágil y transparente.</p>
                  </div>
                  <div className="card">
                    <h3>🔔 Notificaciones</h3>
                    <p>Consulta mensajes personalizados y avisos importantes del sistema.</p>
                  </div>
                  <div className="card">
                    <h3>📊 Dashboard</h3>
                    <p>Accede a un panel intuitivo con la información más relevante para tu gestión.</p>
                  </div>
                </div>

                <br />

                <div className="admin-section">
                  <h2>👨‍💼 Funciones adicionales para administradores</h2>
                  <div className="bienvenida-grid">
                    <div className="card">
                      <h3>👥 Gestión de usuarios y roles</h3>
                    </div>
                    <div className="card">
                      <h3>📂 Consulta y auditoría de logs del sistema</h3>
                    </div>
                    <div className="card">
                      <h3>⚙️ Supervisión general de la plataforma</h3>
                    </div>
                  </div>
                </div>

                <br />

                <div className="objetivos-section">
                  <h2>🎯 Objetivos del sistema</h2>
                  <div className="bienvenida-grid">
                    <div className="card">
                      <h3>✅ Reducir tiempos en la revisión y validación de informes.</h3>
                    </div>
                    <div className="card">
                      <h3>✅ Disminuir el uso de recursos físicos como papel e impresiones.</h3>
                    </div>
                    <div className="card">
                      <h3>✅ Ahorrar traslados innecesarios del personal, fortaleciendo la eficiencia y la sustentabilidad.</h3>
                    </div>
                  </div>
                </div>

                <br />

                <p className="bienvenida-footer">
                  ✨ Tu experiencia en la gestión de informes ahora será más rápida, práctica y segura ✨
                </p>
              </div>
            )}
            {activeTab === "perfil" && (
              <div className="informacion-container">
                <h2 className="perfil-title">Mi Información</h2>
                <form className="perfil-form" onSubmit={handleUpdateUser}>
                  <div className="form-group">
                    <label>Correo</label>
                    <p className="readonly-field">{formData.correo}</p>
                  </div>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido Paterno</label>
                    <input
                      type="text"
                      name="apellidoPaterno"
                      value={formData.apellidoPaterno}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido Materno</label>
                    <input
                      type="text"
                      name="apellidoMaterno"
                      value={formData.apellidoMaterno}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Género</label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  {infoMessage && (
                    <div className={`form-message ${infoMessageType}`}>
                      {infoMessage}
                    </div>
                  )}
                  <button type="submit" className="btn-guardar">Guardar cambios</button>
                </form>
                <h2 className="perfil-title">Seguridad</h2>
                <form className="perfil-form" onSubmit={handleChangePassword}>
                  {!user.tieneContrasena && (
                    <>
                      <div className="form-group password-group">
                        <label>Nueva contraseña</label>
                        <div className="password-wrapper">
                          <input
                            type={showNuevaPassword ? "text" : "password"}
                            name="nuevaPassword"
                            value={passwordData.nuevaPassword}
                            placeholder="Ingresa tu nueva contraseña"
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
                            }
                            required
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowNuevaPassword(!showNuevaPassword)}
                          >
                            {showNuevaPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group password-group">
                        <label>Confirma tu nueva contraseña</label>
                        <div className="password-wrapper">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmarPassword"
                            value={passwordData.confirmarPassword}
                            placeholder="Confirma tu nueva contraseña"
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
                            }
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
                      </div>
                    </>
                  )}

                  {user.tieneContrasena && (
                    <>
                      <div className="form-group password-group">
                        <label>Contraseña actual</label>
                        <div className="password-wrapper">
                          <input
                            type={showPasswordActual ? "text" : "password"}
                            name="passwordActual"
                            value={passwordData.passwordActual}
                            placeholder="Ingresa tu contraseña actual"
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
                            }
                            required
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPasswordActual(!showPasswordActual)}
                          >
                            {showPasswordActual ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group password-group">
                        <label>Nueva contraseña</label>
                        <div className="password-wrapper">
                          <input
                            type={showNuevaPassword ? "text" : "password"}
                            name="nuevaPassword"
                            value={passwordData.nuevaPassword}
                            placeholder="Ingresa tu nueva contraseña"
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
                            }
                            required
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowNuevaPassword(!showNuevaPassword)}
                          >
                            {showNuevaPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group password-group">
                        <label>Confirma tu nueva contraseña</label>
                        <div className="password-wrapper">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmarPassword"
                            value={passwordData.confirmarPassword}
                            placeholder="Confirma tu nueva contraseña"
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
                            }
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
                      </div>
                    </>
                  )}
                  {securityMessage && (
                    <div className={`form-message ${securityMessageType}`}>
                      {securityMessage}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="btn-guardar" 
                    disabled={loadingPassword}
                  >
                    {loadingPassword ? (
                      <>
                        <FaSpinner className="spinner" />
                        Procesando...
                      </>
                    ) : (
                      user.tieneContrasena ? "Cambiar contraseña" : "Generar contraseña"
                    )}
                  </button>
                </form>
              </div>
            )}
            {activeTab === "tutorial" && <div>{/* Tutorial */}</div>}
            {activeTab === "institucion" && (
              <div className="institucion-container">
                <h2 className="institucion-title">Acerca del INE</h2>
                <p className="institucion-subtitle">El INE es la máxima autoridad electoral del Estado Mexicano, que además de llevar a cabo las elecciones federales y emitir la Credencial para Votar, realiza una serie de actividades tanto al interior del instituto como para la ciudadanía.</p>
                <h2 className="institucion-title">09 Junta Distrital Ejecutiva</h2>
                <h3>¿Qué hacemos?</h3>
                <p className="institucion-subtitle">Ejecutar las actividades del Instituto en cada uno de los 300 distritos uninominales electorales, así como evaluar el cumplimiento de los programas relativos al Registro Federal de Electores, Organización Electoral y Capacitación Electoral y Educación Cívica.</p>
                <h3>Ubicación</h3>
                <p className="institucion-subtitle">Carretera San Pablo Tlalchichilpa # 3, Mza. 5, Lote 3, Col. Ejidal, San Felipe del Progreso, Mexico</p>
                <h3>Telefono</h3>
                <p className="institucion-subtitle">712 283 1523</p>

                <div className="redes-sociales">
                  <h2>🌍 Nuestras redes sociales</h2>
                  <div className="redes-botones">
                    <a
                      href="https://www.facebook.com/09JuntaDistritalEdoMex?locale=es_LA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-red"
                    >
                      <FaFacebook />
                      <span>Facebook</span>
                    </a>

                    <a
                      href="https://www.instagram.com/09juntadistritalejecutivaine/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-red"
                    >
                      <FaInstagram />
                      <span>Instagram</span>
                    </a>

                    <a
                      href="https://youtube.com/@inejd09sanfelipedelprogreso?si=9On-3aAXuxJBqPwE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-red"
                    >
                      <FaYoutube />
                      <span>YouTube</span>
                    </a>

                    <a
                      href="https://www.ine.mx/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-red"
                    >
                      <FaGlobe />
                      <span>Página Web</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
        
      </div>

      {/* Modal de notificaciones */}
      {showNotifications && (
        <div className="modal">
          <div className="modal-content">
            <h3>Notificaciones</h3>
            <button className="close-btn" onClick={() => setShowNotifications(false)}>X</button>
            <ul>
              <li>Notificación 1</li>
              <li>Notificación 2</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
