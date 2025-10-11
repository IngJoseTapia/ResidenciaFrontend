// src/hooks/useNotifications.js
import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

// --- Hook personalizado para consumir el contexto ---
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications debe usarse dentro de NotificationProvider"
    );
  }
  return context;
};
