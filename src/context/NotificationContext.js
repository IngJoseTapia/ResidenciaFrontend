// src/context/NotificationContext.js
import { createContext } from "react";

export const NotificationContext = createContext({
  notifications: [],
  loadingNotifications: false,
  error: null,
  reloadNotifications: () => {},
});
