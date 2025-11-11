// src/components/Sidebar.jsx
import {
  FaBars,
  FaSignOutAlt,
  FaHome,
  FaUniversity,
  FaBook,
  FaUser,
  FaBuilding,
  FaUsers,
  FaSpinner,
  FaUserCheck,
  FaAddressBook,
  FaClipboardList,
  FaMapMarkedAlt,
  FaFileAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import "../styles/Sidebar.css";

const MENU_ITEMS = [
  { id: "bienvenida", icon: FaHome, label: "Dashboard", roles: ["ADMIN", "VOCAL", "USER", "RRHH"] },
  { id: "perfil", icon: FaUser, label: "Mi Información", roles: ["ADMIN", "VOCAL", "USER", "RRHH"] },
  { id: "vocalias", icon: FaBuilding, label: "Vocalías", roles: ["ADMIN"] },
  { id: "usuariosPendientes", icon: FaUsers, label: "Usuarios Pendientes", roles: ["ADMIN"] },
  { id: "tutorial", icon: FaBook, label: "Cómo usar", roles: ["USER"] },
  { id: "institucion", icon: FaUniversity, label: "09 Junta Distrital Ejecutiva", roles: ["USER"] },
  { id: "usuariosActivos", icon: FaUserCheck, label: "Usuarios Activos", roles: ["ADMIN", "VOCAL"] },
  { id: "consultaUsuarios", icon: FaAddressBook, label: "Consulta de Usuarios", roles: ["ADMIN"] },
  { id: "consultaLogs", icon: FaClipboardList, label: "Consulta de Logs", roles: ["ADMIN"] },
  { id: "contratos", icon: FaClipboardList, label: "Contratos", roles: ["ADMIN", "RRHH"] },
  { id: "vinculosContratos", icon: FaAddressBook, label: "Vínculos Contratos", roles: ["ADMIN", "RRHH"] },
  { id: "municipios", icon: FaMapMarkedAlt, label: "Municipios", roles: ["ADMIN"] },
  { id: "localidades", icon: FaMapMarkedAlt, label: "Localidades", roles: ["ADMIN"] },
  { id: "zores", icon: FaFileAlt, label: "Zores", roles: ["ADMIN"] },
  { id: "ares", icon: FaFileAlt, label: "Ares", roles: ["ADMIN"] },
  { id: "asignacionesZoreAre", icon: FaClipboardList, label: "Asignación Zore-Are", roles: ["ADMIN"] },
];

const Sidebar = ({ sidebarOpen, toggleSidebar, activeTab, setActiveTab, handleLogout, user, loadingUser }) => {
  const [showText, setShowText] = useState(sidebarOpen);

  useEffect(() => {
    let timer;
    if (sidebarOpen) {
      // Espera a que termine la animación (0.3s)
      timer = setTimeout(() => setShowText(true), 300);
    } else {
      // Oculta el texto inmediatamente al cerrar
      setShowText(false);
    }
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  if (loadingUser) {
    return (
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <button type="button" onClick={toggleSidebar} className="hamburger-btn" aria-label="Abrir o cerrar menú lateral">
            <FaBars />
          </button>
        </div>
        <div className="sidebar-loading">
          <FaSpinner className="spinner-small" />
        </div>
      </aside>
    );
  }

  if (!user) return null;

  const role = user.rol?.toUpperCase() || "";

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      {/* Encabezado del sidebar */}
      <div className="sidebar-header">
        <button type="button" onClick={toggleSidebar} className="hamburger-btn" aria-label="Abrir o cerrar menú lateral">
          <FaBars />
        </button>
      </div>

      {/* Menú principal con scroll */}
      <div className="sidebar-menu-container">
        <nav className="sidebar-menu">
          {MENU_ITEMS.filter(item => item.roles.includes(role)).map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`menu-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <IconComponent className={sidebarOpen ? "icon-normal" : "icon-large"} />
                {showText && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pie del sidebar */}
      <div className="sidebar-footer">
        <button type="button" onClick={handleLogout} className="logout-btn" aria-label="Cerrar sesión">
          <FaSignOutAlt className={sidebarOpen ? "icon-normal" : "icon-large"} />
          {showText && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
