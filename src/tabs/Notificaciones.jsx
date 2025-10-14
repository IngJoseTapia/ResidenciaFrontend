// src/tabs/Notificaciones.jsx
import React, { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { toast } from "react-hot-toast";
import "../styles/Notificaciones.css";

const Notificaciones = ({ setActiveTab }) => {
  const { notifications, loadingNotifications, updateNotificationStatus } =
    useNotifications();
  const [filter, setFilter] = useState("todos");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "noLeidos") return !n.leida;
    if (filter === "sistema") return n.tipoNotificacion === "SISTEMA";
    if (filter === "admin") return n.tipoNotificacion === "ADMIN";
    return true;
  });

  const handleResolve = async (notification) => {
    try {
      await updateNotificationStatus(notification.idRelacion, {
        leida: true,
        resuelta: false,
      });

      // Si es GENERAR_CONTRASENA, redirigir al tab de perfil
      if (notification.template === "GENERAR_CONTRASENA") {
        setActiveTab("perfil");
        toast("🔐 Redirigiendo al formulario de seguridad...");
      } else if (notification.template === "PERFIL_INCOMPLETO") {
        setActiveTab("perfil");
        toast("🔐 Redirigiendo al formulario de información personal...");
      } 
    } catch (err) {
      console.error("Error al actualizar notificación:", err);
    }
  };

  return (
    <div className="notificaciones-container">
      <h2>Centro de Notificaciones</h2>

      {loadingNotifications ? (
        <p>Cargando notificaciones...</p>
      ) : filteredNotifications.length === 0 ? (
        <p>No hay notificaciones disponibles</p>
      ) : (
        <>
          <div className="notificaciones-filtros">
            <button onClick={() => setFilter("todos")}>Todos</button>
            <button onClick={() => setFilter("noLeidos")}>No leídos</button>
            <button onClick={() => setFilter("sistema")}>Sistema</button>
            <button onClick={() => setFilter("admin")}>Administrador</button>
          </div>

          <div className="notificaciones-listado">
            {filteredNotifications.map((n) => (
              <div
                key={n.idRelacion}
                className={`notificacion-card ${n.leida ? "read" : "unread"}`}
              >
                <h3>{n.titulo}</h3>
                <p>{n.mensaje}</p>
                <small>
                  Fecha:{" "}
                  {new Date(n.fechaRecepcion).toLocaleString()}
                </small>
                {/* Botón condicional para GENERAR_CONTRASENA */}
                {!n.resuelta && n.template === "GENERAR_CONTRASENA" && (
                  <button
                    className="resolve-btn"
                    onClick={() => handleResolve(n)}
                  >
                    Ir a Seguridad
                  </button>
                )}
                {!n.resuelta && n.template === "PERFIL_INCOMPLETO" && (
                  <button
                    className="resolve-btn"
                    onClick={() => handleResolve(n)}
                  >
                    Ir a Mi Perfil
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Notificaciones;
