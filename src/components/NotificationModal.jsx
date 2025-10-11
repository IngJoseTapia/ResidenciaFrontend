import "../styles/Notifications.css";

const NotificationModal = ({
  notifications,
  loadingNotifications,
  onClose,
  onViewAll,
}) => {
  return (
    <div className="notifications-dropdown">
      <div className="dropdown-header">
        <h4>Notificaciones</h4>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {loadingNotifications ? (
        <p>Cargando...</p>
      ) : notifications.length === 0 ? (
        <p>No tienes notificaciones nuevas</p>
      ) : (
        <ul className="notifications-list">
          {notifications.slice(0, 5).map((n, index) => (
            <li key={index} className={`notif-item ${n.leida ? "read" : "unread"}`}>
              <div className="notif-title">
                <h4>{n.titulo}</h4>
              </div>
              <div className="notif-message">{n.mensaje}</div>
              <small>{new Date(n.fechaCreacion).toLocaleString()}</small>
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
