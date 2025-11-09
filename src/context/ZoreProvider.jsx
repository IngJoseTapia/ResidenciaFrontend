//src/context/ZoreProvider.jsx
import { useState, useCallback, useEffect, useMemo } from "react";
import { ZoreContext } from "./ZoreContext";
import { zoreService } from "../services/zoreService";
import { useAuth } from "../hooks/useAuth";

export const ZoreProvider = ({ children, user }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [zores, setZores] = useState([]);
  const [usuariosSE, setUsuariosSE] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PAGE_SIZE = 10; // número de registros por página

  // 🔹 Cargar Zores con paginación
  const cargarZores = useCallback(
    async (page = currentPage, size = PAGE_SIZE) => {
      if (user?.rol !== "ADMIN") {
        setError("Acceso denegado: solo los administradores pueden ver esta información.");
        setZores([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await zoreService.listarPaginadas(auth, page, size);
        setZores(data.content || []);
        setPageInfo({
          page: data.number,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });
      } catch (err) {
        console.error("Error al cargar Zores:", err);
        setError(err.message || "Error al cargar Zores");
      } finally {
        setLoading(false);
      }
    },
    [auth, user, currentPage]
  );

  // 🔹 Cargar usuarios con rol SE
  const cargarUsuariosSE = useCallback(async () => {
    try {
      const data = await zoreService.listarUsuariosRolSE(auth);
      setUsuariosSE(data || []);
    } catch (err) {
      console.error("Error al cargar usuarios SE:", err);
      setUsuariosSE([]);
    }
  }, [auth]);

  // 🔹 Crear nueva Zore
  const crearZore = async (dto) => {
    try {
      const data = await zoreService.crear(auth, dto);
      const message = data?.response.mensaje;

      if (data?.apiResponse?.codigo >= 400) {
        return { success: false, message };
      }

      if (data?.zore) setZores((prev) => [...prev, data.zore]);

      return { success: true, message };
    } catch (err) {
      console.error(err);
      const message = err.mensaje || err.message || "Error al crear Zore";
      return { success: false, message };
    }
  };

  // 🔹 Actualizar Zore existente
  const actualizarZore = async (id, dto) => {
    try {
      const data = await zoreService.actualizar(auth, id, dto);
      const message = data?.response.mensaje;

      if (data?.codigo >= 400) return { success: false, message };

      if (data?.zore) {
        // 👉 Reemplazar la Zore completa con la nueva devuelta por el backend
        setZores((prev) => prev.map((z) => (z.id === id ? data.zore : z)));
      }

      return { success: true, message };
    } catch (err) {
      console.error(err);
      const message = err.mensaje || err.message || "Error al actualizar Zore";
      return { success: false, message };
    }
  };

  // 🔹 Efecto para cargar datos iniciales
  useEffect(() => {
    if (auth.jwt && user?.rol === "ADMIN") {
      cargarZores();
      cargarUsuariosSE();
    }
  }, [auth.jwt, user?.rol, cargarZores, cargarUsuariosSE]);

  return (
    <ZoreContext.Provider
      value={{
        zores,
        usuariosSE,
        pageInfo,
        currentPage,
        setCurrentPage,
        loading,
        error,
        cargarZores,
        cargarUsuariosSE,
        crearZore,
        actualizarZore,
      }}
    >
      {children}
    </ZoreContext.Provider>
  );
};
