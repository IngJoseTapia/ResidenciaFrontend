// src/context/NotificationProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { NotificationContext } from "./NotificationContext";
import { toast } from "react-hot-toast"; // 👈 Importar

export const NotificationProvider = ({ children }) => {
  const { jwt, refreshJwt, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);

  // --- Cargar todas las notificaciones ---
  const loadNotifications = useCallback(async () => {
    if (!jwt) return;
    setLoadingNotifications(true);
    setError(null);

    try {
      const data = await fetchWithAuth(
        "http://localhost:8080/notifications",
        { method: "GET" },
        { jwt, refreshJwt, logout }
      );
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar las notificaciones: " + err);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }, [jwt, refreshJwt, logout]);

  // --- ✅ Actualiza el estado local sin recargar todo ---
  const updateNotificationStatus = async (id, statusUpdate) => {
    if (!jwt) return;

    // 🔹 Buscar notificación en el estado local
    const notif = notifications.find(n => n.idRelacion === id);
    if (!notif) return; // seguridad

    // 🔹 Si ya está leída o resuelta, no hacer fetch
    if (notif.leida || notif.resuelta) {
      return;
    }

    try {
      // 🚀 Simplemente await, fetchWithAuth ya maneja errores
      await fetchWithAuth(
        `http://localhost:8080/notifications/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(statusUpdate),
        },
        { jwt, refreshJwt, logout }
      );

      // 🧠 Actualiza el estado local inmediatamente
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.idRelacion === id // 🔹 cambio importante
            ? {
                ...notif,
                ...statusUpdate,
                leida: statusUpdate.leida ?? notif.leida,
                resuelta: statusUpdate.resuelta ?? notif.resuelta,
              }
            : notif
        )
      );

      // 🧠 Mostrar feedback visual
      if (statusUpdate.resuelta) {
        toast.success("✅ Notificación marcada como completada");
      } else if (statusUpdate.leida) {
        toast("📩 Notificación marcada como leída");
      } else {
        toast("🔄 Notificación actualizada");
      }
    } catch (err) {
      console.error("Error al actualizar notificación:", err);
      toast.error("❌ No se pudo actualizar la notificación");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loadingNotifications,
        error,
        reloadNotifications: loadNotifications,
        updateNotificationStatus,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
