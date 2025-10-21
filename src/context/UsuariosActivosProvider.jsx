// src/context/UsuariosActivosProvider.jsx
import { useState, useCallback, useMemo, useEffect } from "react";
import { UsuariosActivosContext } from "./UsuariosActivosContext";
import { getUsuariosActivos, cambiarRolUsuario } from "../services/usuariosActivosService";
import { useAuth } from "../hooks/useAuth";

export const UsuariosActivosProvider = ({ children }) => {
  const { jwt, refreshJwt, logout } = useAuth();

  // 🔹 Memoizamos el objeto de autenticación para evitar renders innecesarios
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  // 🔹 Estados globales
  const [usuarios, setUsuarios] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  /**
   * 🔹 Cargar usuarios activos
   */
  const fetchUsuarios = useCallback(
    async (page = 0) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsuariosActivos(page, 10, auth);
        setUsuarios(data.content || []);
        setPageInfo({ page: data.number, totalPages: data.totalPages });
      } catch (err) {
        setError(err.message || "Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  /**
   * 🔹 Cambiar rol de usuario (no recarga toda la lista)
   * Devuelve el resultado para que el componente maneje el mensaje
   */
  const cambiarRol = useCallback(
    async (id, rol) => {
      try {
        const res = await cambiarRolUsuario(id, rol, auth);
        return {
          success: true,
          message: res.mensaje || "Rol actualizado correctamente ✅",
        };
      } catch (err) {
        return {
          success: false,
          message: err.message || "Error al actualizar el rol ❌",
        };
      }
    },
    [auth]
  );

  // 🔹 Cargar usuarios automáticamente al iniciar
  useEffect(() => {
    if (auth.jwt) fetchUsuarios(0);
  }, [auth.jwt, fetchUsuarios]);

  return (
    <UsuariosActivosContext.Provider
      value={{
        usuarios,
        setUsuarios,
        pageInfo,
        loading,
        error,
        message,
        fetchUsuarios,
        cambiarRol,
        setMessage,
      }}
    >
      {children}
    </UsuariosActivosContext.Provider>
  );
};
