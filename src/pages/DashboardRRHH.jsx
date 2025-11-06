//src/pages/DashboardRRHH.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useNotifications } from "../hooks/useNotifications";

// Providers reutilizables
import { ContratoProvider } from "../context/ContratoProvider";
import { UsuarioContratoProvider } from "../context/UsuarioContratoProvider";

// Componentes base
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import NotificationModal from "../components/NotificationModal";

// Tabs
import Bienvenida from "../tabs/Bienvenida";
import Perfil from "../tabs/Perfil";
import Notificaciones from "../tabs/Notificaciones";
import Contratos from "../tabs/Contratos";
import VinculosContratos from "../tabs/VinculosContratos";

import "../styles/Dashboard.css";

const DashboardRRHH = () => {
  const { logout } = useAuth();
  const { user, loadingUser, updateUserInfo, changePassword } = useUser();
  const { notifications, loadingNotifications, reloadNotifications } = useNotifications();
  const navigate = useNavigate();

  // Estados UI
  const [activeTab, setActiveTab] = useState("bienvenida");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [closingNotifications, setClosingNotifications] = useState(false);

  // --- Handlers ---
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

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

  // --- Loading ---
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
      {/* Sidebar */}
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

            {activeTab === "contratos" && (
                <ContratoProvider user={user}>
                <Contratos />
                </ContratoProvider>
            )}

            {activeTab === "vinculosContratos" && (
                <UsuarioContratoProvider user={user}>
                <VinculosContratos user={user} />
                </UsuarioContratoProvider>
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

export default DashboardRRHH;
