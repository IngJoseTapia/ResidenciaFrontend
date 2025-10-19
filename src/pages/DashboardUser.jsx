//src/pages/DashboardUser.jsx
import React, { useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import NotificationModal from "../components/NotificationModal";

import Bienvenida from "../tabs/Bienvenida";
import Perfil from "../tabs/Perfil";
import Notificaciones from "../tabs/Notificaciones";
import Institucion from "../tabs/Institucion";
import Tutorial from "../tabs/Tutorial";

import "../styles/Dashboard.css";

const DashboardUser = () => {
  const { logout } = useAuth();
  const {
    user,
    loadingUser,
    updateUserInfo,
    changePassword,
  } = useUser();

  const {
    notifications,
    loadingNotifications,
    reloadNotifications,
  } = useNotifications();

  const navigate = useNavigate();

  // --- Estados ---
  const [activeTab, setActiveTab] = useState("bienvenida");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [closingNotifications, setClosingNotifications] = useState(false);

  const handleViewAllNotifications = useCallback(async () => {
    await reloadNotifications();
    setActiveTab("notificaciones");
    setShowNotifications(false);
  }, [reloadNotifications]);

  const toggleNotifications = useCallback(() => {
    if (showNotifications) {
      // si está abierto, cerrar con animación
      setClosingNotifications(true);
      setTimeout(() => {
        setShowNotifications(false);
        setClosingNotifications(false);
      }, 300); // duración del fade-out
    } else {
      // si está cerrado, abrir directamente
      setShowNotifications(true);
    }
  }, [showNotifications]);

  // --- Funciones auxiliares ---
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handleLogout = useCallback(() => {
    logout(); // ya guarda el flag
    navigate("/", { replace: true }); // redirige inmediatamente
  }, [logout, navigate]);

  if (loadingUser) {
    return (
      <div className="dashboard-skeleton">
        <div className="skeleton-header"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        user={user}
      />
      <div className="main-content">
        <Topbar
          user={user}
          onToggleNotifications={toggleNotifications} // ahora alterna abrir/cerrar
          onProfileClick={() => setActiveTab("perfil")}
          onLogout={handleLogout}
        />
        <div className="dashboard-cards">
          <section className="dashboard-content">
            {activeTab === "bienvenida" && <Bienvenida />}
            {activeTab === "perfil" && (
              <Perfil
                user={user}
                updateUserInfo={updateUserInfo}
                changePassword={changePassword}
              />
            )}
            {activeTab === "tutorial" && <Tutorial />}
            {activeTab === "institucion" && <Institucion />}
            {activeTab === "notificaciones" && (
              <Notificaciones
                notifications={notifications}
                loadingNotifications={loadingNotifications}
                reloadNotifications={reloadNotifications}
                setActiveTab={setActiveTab}
              />
            )}
          </section>
        </div>
      </div>
      {showNotifications && (
        <NotificationModal
          notifications={notifications || []}
          loadingNotifications={loadingNotifications}
          onClose={() => {
            setClosingNotifications(true);
            setTimeout(() => setShowNotifications(false), 300);
          }}
          closing={closingNotifications} // <-- para que haga el fade-out
          onViewAll={handleViewAllNotifications}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default DashboardUser;
