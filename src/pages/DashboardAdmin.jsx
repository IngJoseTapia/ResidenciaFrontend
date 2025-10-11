// src/pages/DashboardAdmin.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useNotifications } from "../hooks/useNotifications";

import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import NotificationModal from "../components/NotificationModal";

import Bienvenida from "../tabs/Bienvenida";
import Notificaciones from "../tabs/Notificaciones";
import Perfil from "../tabs/Perfil";
import Vocalias from "../tabs/Vocalias";

import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../styles/Dashboard.css";

const DashboardAdmin = () => {
  const { logout, jwt, refreshJwt } = useAuth();
  const { user, loadingUser, updateUserInfo, changePassword } = useUser();
  const { notifications, loadingNotifications, reloadNotifications } = useNotifications();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bienvenida");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const [vocalias, setVocalias] = useState([]);
  const [loadingVocalias, setLoadingVocalias] = useState(true);
  const [errorVocalias, setErrorVocalias] = useState(null);

  // --- Cargar vocalías solo si el usuario es admin y cambia el JWT ---
  useEffect(() => {
    if (!user || user.rol !== "ADMIN") return;

    const fetchVocalias = async () => {
      setLoadingVocalias(true);
      setErrorVocalias(null);
      try {
        const data = await fetchWithAuth(
          "http://localhost:8080/admin/vocalia",
          { method: "GET" },
          { jwt, refreshJwt, logout }
        );
        setVocalias(data || []);
      } catch (err) {
        setErrorVocalias(err.message);
      } finally {
        setLoadingVocalias(false);
      }
    };

    fetchVocalias();
  }, [user, jwt, refreshJwt, logout]);

  // --- Handlers ---
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const handleViewAllNotifications = useCallback(async () => {
    await reloadNotifications();
    setActiveTab("notificaciones");
    setShowNotifications(false);
  }, [reloadNotifications]);

  if (loadingUser) return <p>Cargando información del usuario...</p>;

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

            {activeTab === "vocalias" && (
              <Vocalias
                vocalias={vocalias}
                loading={loadingVocalias}
                error={errorVocalias}
              />
            )}

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

      {showNotifications && (
        <NotificationModal
          notifications={notifications || []}
          loadingNotifications={loadingNotifications}
          onClose={() => setShowNotifications(false)}
          onViewAll={handleViewAllNotifications}
        />
      )}
    </div>
  );
};

export default DashboardAdmin;
