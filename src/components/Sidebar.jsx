//src/components/Sidebar.jsx
import {
  FaBars,
  FaSignOutAlt,
  FaHome,
  FaUniversity,
  FaBook,
  FaUser,
  FaBuilding,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import "../styles/Sidebar.css";

/**
 * Sidebar Component
 * Muestra el menú lateral adaptado al rol del usuario.
 */
const Sidebar = ({
  sidebarOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
  handleLogout,
}) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user?.role?.toUpperCase() || "";

  // Definición del menú dinámico
  const menuItems = [
    { id: "bienvenida", icon: FaHome, label: "Dashboard", roles: ["ADMIN", "USER"] },
    { id: "perfil", icon: FaUser, label: "Mi Información", roles: ["ADMIN", "USER"] },
    { id: "vocalias", icon: FaBuilding, label: "Vocalías", roles: ["ADMIN"] },
    { id: "tutorial", icon: FaBook, label: "Cómo usar", roles: ["USER"] },
    {
      id: "institucion",
      icon: FaUniversity,
      label: "09 Junta Distrital Ejecutiva",
      roles: ["USER"],
    },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      {/* Encabezado del sidebar */}
      <div className="sidebar-header">
        <button
          type="button"
          onClick={toggleSidebar}
          className="hamburger-btn"
          aria-label="Abrir o cerrar menú lateral"
        >
          <FaBars />
        </button>
      </div>

      {/* Menú principal */}
      <nav className="sidebar-menu">
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`menu-item ${activeTab === item.id ? "active" : ""}`}
              >
                <IconComponent className={sidebarOpen ? "icon-normal" : "icon-large"} />
                <span>{item.label}</span>
              </button>
            );
          })}
      </nav>

      {/* Pie del sidebar */}
      <div className="sidebar-footer">
        <button
          type="button"
          onClick={handleLogout}
          className="logout-btn"
          aria-label="Cerrar sesión"
        >
          <FaSignOutAlt className={sidebarOpen ? "icon-normal" : "icon-large"} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
