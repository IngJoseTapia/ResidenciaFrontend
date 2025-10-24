// src/context/ConsultaUsuariosProvider.jsx
import { useState, useCallback, useMemo, useEffect } from "react";
import { ConsultaUsuariosContext } from "./ConsultaUsuariosContext";
import {
  getConsultaUsuarios,
  eliminarUsuarioInactivo,
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
  // src/context/ConsultaUsuariosProvider.jsx
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
        eliminarUsuario, // ✅ Lógica centralizada
      }}
    >
      {children}
    </ConsultaUsuariosContext.Provider>
  );
};
