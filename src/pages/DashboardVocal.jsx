//src/pages/DashboardVocal.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useNotifications } from "../hooks/useNotifications";

// Providers compartidos
import { VocaliaProvider } from "../context/VocaliaProvider";
import { AsignacionProvider } from "../context/AsignacionProvider";
import { UsuariosActivosProvider } from "../context/UsuariosActivosProvider";

// Componentes base
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import NotificationModal from "../components/NotificationModal";

// Tabs
import Bienvenida from "../tabs/Bienvenida";
import Perfil from "../tabs/Perfil";
import Notificaciones from "../tabs/Notificaciones";
import Vocalias from "../tabs/Vocalias";
import UsuariosPendientes from "../tabs/UsuariosPendientes";
import UsuariosActivos from "../tabs/UsuariosActivos";

import "../styles/Dashboard.css";

const DashboardVocal = () => {
  const { logout } = useAuth();
  const { user, loadingUser, updateUserInfo, changePassword } = useUser();
  const { notifications, loadingNotifications, reloadNotifications } = useNotifications();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bienvenida");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [closingNotifications, setClosingNotifications] = useState(false);

  // --- Lógica de notificaciones ---
  const toggleNotifications = useCallback(() => {
    if (showNotifications) {
      setClosingNotifications(true);
      setTimeout(() => {
        setShowNotifications(false);
        setClosingNotifications(false);
      }, 300);
    } else {
      setShowNotifications(true);
    }
  }, [showNotifications]);

  const handleViewAllNotifications = useCallback(async () => {
    await reloadNotifications();
    setActiveTab("notificaciones");
    setShowNotifications(false);
  }, [reloadNotifications]);

  // --- Control de sidebar y logout ---
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
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
      {/* Sidebar con tabs dinámicos */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        user={user}
        loadingUser={loadingUser}
      />

      {/* Contenido principal */}
      <div className="main-content">
        <Topbar
          user={user}
          onToggleNotifications={toggleNotifications}
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

            {activeTab === "vocalias" && (
              <VocaliaProvider user={user}>
                <Vocalias />
              </VocaliaProvider>
            )}

            {activeTab === "usuariosPendientes" && (
              <VocaliaProvider user={user}>
                <AsignacionProvider user={user}>
                  <UsuariosPendientes />
                </AsignacionProvider>
              </VocaliaProvider>
            )}

            {activeTab === "usuariosActivos" && (
              <UsuariosActivosProvider user={user}>
                <UsuariosActivos />
              </UsuariosActivosProvider>
            )}

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

      {/* Modal de notificaciones */}
      {showNotifications && (
        <NotificationModal
          notifications={notifications || []}
          loadingNotifications={loadingNotifications}
          onClose={() => {
            setClosingNotifications(true);
            setTimeout(() => setShowNotifications(false), 300);
          }}
          closing={closingNotifications}
          onViewAll={handleViewAllNotifications}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default DashboardVocal;
