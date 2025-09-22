// src/context/UserProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import { useAuth } from "../hooks/useAuth";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export const UserProvider = ({ children }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const [user, setUser] = useState(null);

  const loadUserInfo = useCallback(async () => {
    if (!jwt) return;

    try {
      const response = await fetchWithAuth(
        "http://localhost:8080/user/info",
        { method: "GET" },
        { jwt, refreshJwt, logout }
      );

      if (!response.ok) throw new Error("No se pudo cargar la información del usuario");

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error al cargar info de usuario:", error);
    }
  }, [jwt, refreshJwt, logout]);

  useEffect(() => {
    if (!jwt) return; // evita fetch innecesario
    loadUserInfo();
  }, [loadUserInfo, jwt]);

  return (
    <UserContext.Provider value={{ user, loadUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
