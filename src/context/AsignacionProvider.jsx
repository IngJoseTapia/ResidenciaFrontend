// src/context/AsignacionProvider.jsx
import { useState, useCallback, useEffect, useMemo } from "react";
import { AsignacionContext } from "./AsignacionContext";
import { getUsuariosPendientes, asignarVocalia } from "../services/asignacionService";
import { useAuth } from "../hooks/useAuth";


export const AsignacionProvider = ({ children, user }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [usuariosPendientes, setUsuariosPendientes] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsuariosPendientes = useCallback(
    async (page = 0, size = 20) => {
      if (user?.rol !== "ADMIN") {
        setError("Acceso denegado: solo los administradores pueden ver esta información.");
        setUsuariosPendientes([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getUsuariosPendientes(page, size, auth);

        setUsuariosPendientes(data.content); // 🔹 Guardamos tal cual viene del backend
        setPageInfo({
          page: data.number,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });

      } catch (err) {
        console.error("Error al obtener usuarios pendientes:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    },
    [auth, user]
  );

  const asignarVocaliaAUsuario = useCallback(
    async (usuarioId, vocaliaId) => {
      if (user?.rol !== "ADMIN") {
        throw new Error("Acceso denegado: solo los administradores pueden asignar vocalías.");
      }

      try {
        const response = await asignarVocalia(usuarioId, vocaliaId, auth);

        // 🔹 Eliminamos el usuario asignado usando id
        setUsuariosPendientes(prev =>
          prev.filter(usuario => usuario.id !== usuarioId)
        );

        return response;
      } catch (err) {
        console.error("Error al asignar vocalía:", err);
        throw err;
      }
    },
    [auth, user]
  );

  useEffect(() => {
    if (auth.jwt && user?.rol === "ADMIN") {
      fetchUsuariosPendientes();
    }
  }, [auth.jwt, user?.rol, fetchUsuariosPendientes]);

  return (
    <AsignacionContext.Provider
      value={{
        usuariosPendientes,
        pageInfo,
        loading,
        error,
        fetchUsuariosPendientes,
        asignarVocaliaAUsuario,
      }}
    >
      {children}
    </AsignacionContext.Provider>
  );
};
