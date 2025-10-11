// src/context/UserProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import { useAuth } from "../hooks/useAuth";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export const UserProvider = ({ children }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  /** 🔹 Cargar información del usuario */
  const loadUserInfo = useCallback(async () => {
    if (!jwt) return;
    setLoadingUser(true);
    try {
      const data = await fetchWithAuth(
        "http://localhost:8080/user/info",
        { method: "GET" },
        { jwt, refreshJwt, logout }
      );
      setUser(data);
    } catch (error) {
      console.error("Error al cargar info de usuario:", error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, [jwt, refreshJwt, logout]);

  /** 🔹 Actualizar info de usuario */
  const updateUserInfo = useCallback(
    async (userData) => {
      try {
        const data = await fetchWithAuth(
          "http://localhost:8080/user/info",
          { method: "PUT", body: JSON.stringify(userData) },
          { jwt, refreshJwt, logout }
        );

        // Actualizamos solo los campos modificados
        setUser(prev => ({ ...prev, ...userData }));

        return { success: true, message: data.message || "Información actualizada correctamente✅" };
      } catch (error) {
        let mensaje = "No se pudo actualizar la información ❌";
        try {
          const parsed = JSON.parse(error.message);
          // 🔹 Revisar si existe 'mensaje' (minúscula) o 'message'
          mensaje = parsed?.mensaje || parsed?.message || mensaje;
        } catch {
          mensaje = error?.message || mensaje;
        }
        return { success: false, message: mensaje };
      }
    },
    [jwt, refreshJwt, logout]
  );

  /** 🔹 Cambiar contraseña */
  const changePassword = useCallback(
    async (passwordData) => {
      try {
        const data = await fetchWithAuth(
          "http://localhost:8080/user/info/password",
          { method: "PUT", body: JSON.stringify(passwordData) },
          { jwt, refreshJwt, logout }
        );

        // Actualizamos localmente el usuario para evitar cualquier refresh
        setUser(prev => ({ ...prev, tieneContrasena: true }));

        return { success: true, message: data.message || "Contraseña actualizada exitosamente✅" };
      } catch (error) {
        let mensaje = error?.message || "No se pudo actualizar la contraseña ❌";
        try {
          const parsed = JSON.parse(error.message);
          mensaje = parsed?.mensaje || parsed?.message || mensaje;
        } catch {
          mensaje = error?.message || mensaje;
        }
        return { success: false, message: mensaje };
      }
    },
    [jwt, refreshJwt, logout]
  );

  // Cargar usuario al iniciar
  useEffect(() => {
    if (jwt) loadUserInfo();
  }, [jwt, loadUserInfo]);

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser,
        loadUserInfo,
        updateUserInfo,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
