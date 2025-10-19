// src/components/Topbar.jsx
import { FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNotifications } from "../hooks/useNotifications"; // ✅ Usa tu hook
import "../styles/Topbar.css";

const Topbar = ({ user, onToggleNotifications, onProfileClick, onLogout }) => {
  const { notifications, loadingNotifications } = useNotifications();

  // 🔹 Calcula cuántas notificaciones no están leídas (según tu estructura)
  const unreadCount = notifications?.filter((n) => !n.leida)?.length || 0;

  const actions = [
    { icon: FaBell, onClick: onToggleNotifications, label: "Notificaciones" },
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
          const isBell = action.icon === FaBell;

          return (
            <button
              key={index}
              type="button"
              onClick={action.onClick}
              className="icon-btn"
              aria-label={action.label}
            >
              <div className="icon-wrapper">
                <IconComponent />
                {/* ✅ Mostrar badge solo si hay notificaciones no leídas */}
                {isBell && !loadingNotifications && unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Topbar;
