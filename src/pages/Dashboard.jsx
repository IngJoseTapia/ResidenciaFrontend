import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaHome, FaUniversity, FaBook } from "react-icons/fa";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { logout } = useAuth();
  const { user, loadUserInfo } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bienvenida");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

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
            <span>Institución</span>
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
              <div>
                <p>Este es tu espacio personal dentro del sistema...</p>
              </div>
            )}
            {activeTab === "perfil" && (
              <div>
                <h2>Mi Información</h2>
                {/* Formulario del perfil */}
              </div>
            )}
            {activeTab === "tutorial" && <div>{/* Tutorial */}</div>}
            {activeTab === "institucion" && <div>{/* Institución */}</div>}
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
