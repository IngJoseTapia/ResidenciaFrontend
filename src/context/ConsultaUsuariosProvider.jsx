// src/context/ConsultaUsuariosProvider.jsx
import { useState, useCallback, useMemo, useEffect } from "react";
import { ConsultaUsuariosContext } from "./ConsultaUsuariosContext";
import {
  getConsultaUsuarios,
  eliminarUsuarioInactivo,
  cambiarCorreoUsuario,
  cambiarContrasenaUsuario,
  cambiarStatusUsuario,
} from "../services/consultaUsuariosService";
import { useAuth } from "../hooks/useAuth";

export const ConsultaUsuariosProvider = ({ children }) => {
  const { jwt, refreshJwt, logout } = useAuth();

  // 🔹 Memoizamos la autenticación
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  // 🔹 Estados globales
  const [usuarios, setUsuarios] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // 🔹 Tamaño de página controlado internamente
  const PAGE_SIZE = 10;

  /**
   * 🔹 Obtener lista de usuarios (paginado)
   */
  const fetchUsuarios = useCallback(
    async (page = 0) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getConsultaUsuarios(page, PAGE_SIZE, auth);
        setUsuarios(data.content || []);
        setPageInfo({
          page: data.number || 0,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
        });
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError(err.message || "Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  /**
   * 🔹 Eliminar usuario inactivo
   */
  const eliminarUsuario = useCallback(
    async (usuarioId) => {
      try {
        const res = await eliminarUsuarioInactivo(usuarioId, auth);

        // 🔹 Eliminamos localmente
        setUsuarios((prev) => prev.filter((u) => u.id !== usuarioId));

        // 🔹 Retornamos el mensaje al componente que lo invocó
        return res?.mensaje || "Usuario eliminado correctamente";
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        // 🔹 NO usamos setError ni setMessage, solo lanzamos el error
        throw new Error(err.message || "Error al eliminar usuario");
      }
    },
    [auth]
  );

  /** 🔹 Cambiar correo */
  const actualizarCorreoUsuario = useCallback(async (usuarioId, nuevoCorreo) => {
    try {
      const res = await cambiarCorreoUsuario(usuarioId, nuevoCorreo, auth);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioId ? { ...u, correo: nuevoCorreo } : u))
      );
      return res?.mensaje || "Correo actualizado correctamente";
    } catch (err) {
      console.error("Error al cambiar correo:", err);
      throw new Error(err.message || "Error al cambiar correo");
    }
  }, [auth]);

  /** 🔹 Cambiar contraseña */
  const actualizarContrasenaUsuario = useCallback(async (usuarioId, nuevaContrasena) => {
    try {
      const res = await cambiarContrasenaUsuario(usuarioId, nuevaContrasena, auth);
      return res?.mensaje || "Contraseña actualizada correctamente";
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      throw new Error(err.message || "Error al cambiar contraseña");
    }
  }, [auth]);

  /** 🔹 Cambiar status (ACTIVO / INACTIVO) */
  const actualizarStatusUsuario = useCallback(async (usuarioId, nuevoStatus) => {
    try {
      const res = await cambiarStatusUsuario(usuarioId, nuevoStatus, auth);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioId ? { ...u, status: nuevoStatus } : u))
      );
      return res?.mensaje || `Status cambiado a ${nuevoStatus}`;
    } catch (err) {
      console.error("Error al cambiar status:", err);
      throw new Error(err.message || "Error al cambiar status");
    }
  }, [auth]);

  /**
   * 🔹 Cargar al montar
   */
  useEffect(() => {
    if (auth.jwt) fetchUsuarios(0);
  }, [auth.jwt, fetchUsuarios]);

  return (
    <ConsultaUsuariosContext.Provider
      value={{
        usuarios,
        setUsuarios,
        pageInfo,
        loading,
        error,
        message,
        setMessage,
        fetchUsuarios,
        eliminarUsuario,
        actualizarCorreoUsuario,
        actualizarContrasenaUsuario,
        actualizarStatusUsuario,
      }}
    >
      {children}
    </ConsultaUsuariosContext.Provider>
  );
};
