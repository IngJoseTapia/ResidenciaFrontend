// src/pages/DashboardAdmin.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useNotifications } from "../hooks/useNotifications";
import { VocaliaProvider } from "../context/VocaliaProvider";
import { AsignacionProvider } from "../context/AsignacionProvider";
import { UsuariosActivosProvider } from "../context/UsuariosActivosProvider";
import { ConsultaUsuariosProvider } from "../context/ConsultaUsuariosProvider";
import { LogsSistemaProvider } from "../context/LogsSistemaProvider";
import { ContratoProvider } from "../context/ContratoProvider";
import { UsuarioContratoProvider } from "../context/UsuarioContratoProvider";
import { MunicipioProvider } from "../context/MunicipioProvider";
import { ZoreProvider } from "../context/ZoreProvider";
import { AreProvider } from "../context/AreProvider";
import { AsignacionZoreAreProvider } from "../context/AsignacionZoreAreProvider";
import { LocalidadProvider } from "../context/LocalidadProvider";
import { SeccionProvider } from "../context/SeccionProvider";

import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import NotificationModal from "../components/NotificationModal";

import Bienvenida from "../tabs/Bienvenida";
import Notificaciones from "../tabs/Notificaciones";
import Perfil from "../tabs/Perfil";
import Vocalias from "../tabs/Vocalias";
import UsuariosPendientes from "../tabs/UsuariosPendientes";
import UsuariosActivos from "../tabs/UsuariosActivos";
import ConsultaUsuarios from "../tabs/ConsultaUsuarios";
import ConsultaLogs from "../tabs/ConsultaLogs";
import Contratos from "../tabs/Contratos";
import VinculosContratos from "../tabs/VinculosContratos";
import Municipios from "../tabs/Municipios";
import Zores from "../tabs/Zores";
import Ares from "../tabs/Ares";
import AsignacionesZoreAre from "../tabs/AsignacionesZoreAre";
import Localidades from "../tabs/Localidades";
import Secciones from "../tabs/Secciones";

import "../styles/Dashboard.css";

const DashboardAdmin = () => {
  const { logout } = useAuth();
  const { user, loadingUser, updateUserInfo, changePassword } = useUser();
  const { notifications, loadingNotifications, reloadNotifications } = useNotifications();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bienvenida");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [closingNotifications, setClosingNotifications] = useState(false);

  const toggleNotifications = useCallback(() => {
    if (showNotifications) {
      // si está abierto, cerrar con animación
      setClosingNotifications(true);
      setTimeout(() => {
        setShowNotifications(false);
        setClosingNotifications(false);
      }, 300);
    } else {
      // si está cerrado, abrir directamente
      setShowNotifications(true);
    }
  }, [showNotifications]);

  // --- Handlers ---
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handleLogout = useCallback(() => {
    logout(); // ya guarda el flag
    navigate("/", { replace: true }); // redirige inmediatamente
  }, [logout, navigate]);

  const handleViewAllNotifications = useCallback(async () => {
    await reloadNotifications();
    setActiveTab("notificaciones");
    setShowNotifications(false);
  }, [reloadNotifications]);

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
        loadingUser={loadingUser}
      />

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

            {activeTab === "consultaUsuarios" && (
              <ConsultaUsuariosProvider>
                <ConsultaUsuarios />
              </ConsultaUsuariosProvider>
            )}

            {activeTab === "consultaLogs" && (
              <LogsSistemaProvider>
                <ConsultaLogs />
              </LogsSistemaProvider>
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

            {activeTab === "municipios" && (
              <MunicipioProvider user={user}>
                <Municipios />
              </MunicipioProvider>
            )}

            {activeTab === "localidades" && (
              <MunicipioProvider user={user}>
                <LocalidadProvider user={user}>
                  <Localidades />
                </LocalidadProvider>
              </MunicipioProvider>
            )}

            {activeTab === "secciones" && (
              <SeccionProvider user={user}>
                <Secciones />
              </SeccionProvider>
            )}

            {activeTab === "zores" && (
              <ZoreProvider user={user}>
                <Zores />
              </ZoreProvider>
            )}

            {activeTab === "ares" && (
              <AreProvider user={user}>
                <Ares />
              </AreProvider>
            )}

            {activeTab === "asignacionesZoreAre" && (
              <AsignacionZoreAreProvider user={user}>
                <AsignacionesZoreAre user={user} />
              </AsignacionZoreAreProvider>
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

export default DashboardAdmin;
