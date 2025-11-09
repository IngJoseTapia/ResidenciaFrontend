//src/context/AreProvider.jsx
import { useState, useCallback, useEffect, useMemo } from "react";
import { AreContext } from "./AreContext";
import { areService } from "../services/areService";
import { useAuth } from "../hooks/useAuth";

export const AreProvider = ({ children, user }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [ares, setAres] = useState([]);
  const [usuariosCAE, setUsuariosCAE] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PAGE_SIZE = 10;

  // 🔹 Cargar Ares con paginación
  const cargarAres = useCallback(
    async (page = currentPage, size = PAGE_SIZE) => {
      if (user?.rol !== "ADMIN") {
        setError("Acceso denegado: solo los administradores pueden ver esta información.");
        setAres([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await areService.listarPaginadas(auth, page, size);
        setAres(data.content || []);
        setPageInfo({
          page: data.number,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });
      } catch (err) {
        console.error("Error al cargar Ares:", err);
        setError(err.message || "Error al cargar Ares");
      } finally {
        setLoading(false);
      }
    },
    [auth, user, currentPage]
  );

  // 🔹 Cargar usuarios con rol CAE
  const cargarUsuariosCAE = useCallback(async () => {
    try {
      const data = await areService.listarUsuariosRolCAE(auth);
      setUsuariosCAE(data || []);
    } catch (err) {
      console.error("Error al cargar usuarios CAE:", err);
      setUsuariosCAE([]);
    }
  }, [auth]);

  // 🔹 Crear nueva Are
  const crearAre = async (dto) => {
    try {
      const data = await areService.crear(auth, dto);
      const message = data?.response?.mensaje || "Are creada correctamente ✅";

      if (data?.apiResponse?.codigo >= 400) {
        return { success: false, message };
      }

      if (data?.are) setAres((prev) => [...prev, data.are]);

      return { success: true, message };
    } catch (err) {
      console.error(err);
      const message = err.mensaje || err.message || "Error al crear Are";
      return { success: false, message };
    }
  };

  // 🔹 Actualizar Are existente
  const actualizarAre = async (id, dto) => {
    try {
      const data = await areService.actualizar(auth, id, dto);
      const message = data?.response?.mensaje || "Are actualizada correctamente ✅";

      if (data?.codigo >= 400) return { success: false, message };

      if (data?.are) {
        setAres((prev) => prev.map((a) => (a.id === id ? data.are : a)));
      }

      return { success: true, message };
    } catch (err) {
      console.error(err);
      const message = err.mensaje || err.message || "Error al actualizar Are";
      return { success: false, message };
    }
  };

  // 🔹 Efecto inicial
  useEffect(() => {
    if (auth.jwt && user?.rol === "ADMIN") {
      cargarAres();
      cargarUsuariosCAE();
    }
  }, [auth.jwt, user?.rol, cargarAres, cargarUsuariosCAE]);

  return (
    <AreContext.Provider
      value={{
        ares,
        usuariosCAE,
        pageInfo,
        currentPage,
        setCurrentPage,
        loading,
        error,
        cargarAres,
        cargarUsuariosCAE,
        crearAre,
        actualizarAre,
      }}
    >
      {children}
    </AreContext.Provider>
  );
};
