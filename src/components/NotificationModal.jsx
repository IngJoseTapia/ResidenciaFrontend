// src/components/NotificationModal.jsx
import "../styles/Notifications.css";
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { toast } from "react-hot-toast";
import { FaTimes, FaKey, FaUserEdit } from "react-icons/fa";

const NotificationModal = ({
  notifications,
  loadingNotifications,
  onClose,
  onViewAll,
  setActiveTab,
}) => {
  const { updateNotificationStatus } = useNotifications();
  const [closing, setClosing] = useState(false);

  const handleGeneratePassword = async (notification) => {
    // 1️⃣ Marcar como leída/resuelta
    await updateNotificationStatus(notification.idRelacion, {
      leida: true,
      resuelta: false,
    });

    // 2️⃣ Redirigir al tab de perfil
    setActiveTab("perfil");
    toast("🔐 Redirigiendo al formulario de seguridad...");

    // 3️⃣ Cerrar modal
    handleClose();
  };

  const handleUpdateProfile = async (notification) => {
    // 1️⃣ Marcar como leída/resuelta
    await updateNotificationStatus(notification.idRelacion, {
      leida: true,
      resuelta: false,
    });

    // 2️⃣ Redirigir al tab de perfil
    setActiveTab("perfil");
    toast("🔐 Redirigiendo al formulario de información personal...");

    // 3️⃣ Cerrar modal
    handleClose();
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // igual que la duración de fadeOut
  };

  return (
    <div className={`notifications-dropdown ${closing ? "fade-out" : ""}`}>
      <div className="dropdown-header">
        <h3 className="header">Notificaciones</h3>
        <button className="close-btn" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>

      {loadingNotifications ? (
        <p>Cargando...</p>
      ) : notifications.length === 0 ? (
        <p>No tienes notificaciones nuevas</p>
      ) : (
        <ul className="notifications-list">
          {notifications.slice(0, 5).map((n) => (
            <li
              key={n.idRelacion}
              className={`notif-item ${n.leida ? "read" : "unread"}`}
            >
              <div className="notif-title">
                {!n.leida && <span className="new-badge">●</span>}
                {n.template === "GENERAR_CONTRASENA" && <FaKey className="notif-icon" />}
                {n.template === "PERFIL_INCOMPLETO" && <FaUserEdit className="notif-icon" />}
                <h4>{n.titulo}</h4>
              </div>
              <div className="notif-message">{n.mensaje}</div>
              <small>
                {new Date(n.fechaRecepcion).toLocaleDateString("es-MX", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </small>


              {!n.resuelta && n.template === "GENERAR_CONTRASENA" && (
                <button
                  className="notif-resolve-btn"
                  onClick={() => handleGeneratePassword(n)}
                >
                  Generar contraseña
                </button>
              )}
              {!n.resuelta && n.template === "PERFIL_INCOMPLETO" && (
                <button
                  className="notif-resolve-btn"
                  onClick={() => handleUpdateProfile(n)}
                >
                  Actualizar datos personales
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <button className="ver-todas-btn" onClick={onViewAll}>
        Ver todas
      </button>
    </div>
  );
};

export default NotificationModal;
