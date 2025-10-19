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
  FaSpinner
} from "react-icons/fa";
import { useUser } from "../hooks/useUser";
import "../styles/Sidebar.css";

const MENU_ITEMS = [
  { id: "bienvenida", icon: FaHome, label: "Dashboard", roles: ["ADMIN", "USER"] },
  { id: "perfil", icon: FaUser, label: "Mi Información", roles: ["ADMIN", "USER"] },
  { id: "vocalias", icon: FaBuilding, label: "Vocalías", roles: ["ADMIN"] },
  { id: "usuariosPendientes", icon: FaUsers, label: "Usuarios Pendientes", roles: ["ADMIN"] },
  { id: "tutorial", icon: FaBook, label: "Cómo usar", roles: ["USER"] },
  { id: "institucion", icon: FaUniversity, label: "09 Junta Distrital Ejecutiva", roles: ["USER"] },
];

const Sidebar = ({ sidebarOpen, toggleSidebar, activeTab, setActiveTab, handleLogout }) => {
  const { user, loadingUser } = useUser();

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

      {/* Menú principal */}
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
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Pie del sidebar */}
      <div className="sidebar-footer">
        <button type="button" onClick={handleLogout} className="logout-btn" aria-label="Cerrar sesión">
          <FaSignOutAlt className={sidebarOpen ? "icon-normal" : "icon-large"} />
          {sidebarOpen && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
