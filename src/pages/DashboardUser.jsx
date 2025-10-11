//src/pages/DashboardUser.jsx
import React, { useState } from "react";
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

const Dashboard = () => {
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

  // --- Funciones auxiliares ---
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loadingUser) return <p>Cargando información del usuario...</p>;

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Contenido principal */}
      <div className="main-content">
        <Topbar
          user={user}
          onShowNotifications={() => setShowNotifications(true)}
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
              />
            )}
          </section>
        </div>
      </div>

      {/* Modal de notificaciones */}
      {showNotifications && (
        <NotificationModal
          notifications={notifications}
          loadingNotifications={loadingNotifications}
          onClose={() => setShowNotifications(false)}
          onViewAll={() => {
            setActiveTab("notificaciones");
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
