// src/tabs/Notificaciones.jsx
import React from "react";
import "../styles/Dashboard.css"; // Asegúrate de importar el CSS si lo usas aquí

const Notificaciones = ({ notifications, loadingNotifications }) => {
  return (
    <div className="notificaciones-container">
      <h2>Centro de Notificaciones</h2>
      {loadingNotifications ? (
        <p>Cargando notificaciones...</p>
      ) : (notifications || []).length === 0 ? (
        <p>No hay notificaciones disponibles</p>
      ) : (
        <>
          <div className="notificaciones-filtros">
            <button>Todos</button>
            <button>No leídos</button>
            <button>Sistema</button>
            <button>Administrador</button>
          </div>

          <div className="notificaciones-listado">
            {notifications.map((n, index) => (
              <div
                key={index}
                className={`notificacion-card ${n.leida ? "read" : "unread"}`}
              >
                <h3>{n.titulo}</h3>
                <p>{n.mensaje}</p>
                <small>
                  Fecha: {new Date(n.fechaCreacion).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Notificaciones;
