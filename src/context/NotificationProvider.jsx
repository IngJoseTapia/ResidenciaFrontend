// src/context/NotificationProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { NotificationContext } from "./NotificationContext";

export const NotificationProvider = ({ children }) => {
  const { jwt, refreshJwt, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);

  // --- Función para cargar notificaciones ---
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

      // Asegurar que siempre sea un array
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar las notificaciones" + err);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }, [jwt, refreshJwt, logout]);

  // --- Cargar notificaciones al montar ---
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // --- Valor del contexto ---
  const contextValue = {
    notifications,
    loadingNotifications,
    error,
    reloadNotifications: loadNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
