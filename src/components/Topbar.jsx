//src/components/Topbar.jsx
import { FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import "../styles/Topbar.css";

/**
 * Topbar Component
 * Muestra el nombre del usuario y los accesos rápidos (notificaciones, perfil, cerrar sesión)
 */
const Topbar = ({ user, onShowNotifications, onProfileClick, onLogout }) => {
  const actions = [
    { icon: FaBell, onClick: onShowNotifications, label: "Notificaciones" },
    { icon: FaUser, onClick: onProfileClick, label: "Perfil" },
    { icon: FaSignOutAlt, onClick: onLogout, label: "Cerrar sesión" },
  ];

  return (
    <header className="topbar">
      <div className="left-section">
        <h2 className="welcome-text">
          Bienvenido, <span className="username">{user?.nombre || "Usuario"}</span>
        </h2>
      </div>

      <div className="right-section">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={action.onClick}
              className="icon-btn"
              aria-label={action.label}
            >
              <IconComponent />
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Topbar;
