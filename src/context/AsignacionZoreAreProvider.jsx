//src/context/AsignacionZoreAreProvider.jsx
import { useState, useCallback, useEffect, useMemo } from "react";
import { AsignacionZoreAreContext } from "./AsignacionZoreAreContext";
import { asignacionZoreAreService } from "../services/asignacionZoreAreService";
import { useAuth } from "../hooks/useAuth";

export const AsignacionZoreAreProvider = ({ children, user }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [asignaciones, setAsignaciones] = useState([]);
  const [anios, setAnios] = useState([]);
  const [zores, setZores] = useState([]);
  const [ares, setAres] = useState([]);

  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PAGE_SIZE = 10;

  // 🔹 Cargar asignaciones con paginación
  const cargarAsignaciones = useCallback(async (page = currentPage, size = PAGE_SIZE) => {
    if (user?.rol !== "ADMIN") {
      setError("Acceso denegado: solo los administradores pueden ver esta información.");
      setAsignaciones([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await asignacionZoreAreService.listarPaginadas(auth, page, size);
      setAsignaciones(data.content || []);
      setPageInfo({
        page: data.number,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      console.error("Error al cargar asignaciones:", err);
      setError(err.message || "Error al cargar asignaciones");
    } finally {
      setLoading(false);
    }
  }, [auth, user, currentPage]);

  // 🔹 Cargar años disponibles (para dropdown)
  const cargarAniosZore = useCallback(async () => {
    try {
      const data = await asignacionZoreAreService.listarAniosZore(auth);
      setAnios(data || []);
    } catch (err) {
      console.error("Error al cargar años ZORE:", err);
      setAnios([]);
    }
  }, [auth]);

  // 🔹 Cargar Zores por año
  const cargarZoresPorAnio = useCallback(async (anio) => {
    try {
      const data = await asignacionZoreAreService.listarZoresPorAnio(auth, anio);
      setZores(data || []);
    } catch (err) {
      console.error("Error al cargar ZOREs:", err);
      setZores([]);
    }
  }, [auth]);

  // 🔹 Cargar ARE por año (disponibles)
  const cargarAresPorAnio = useCallback(async (anio) => {
    try {
      const data = await asignacionZoreAreService.listarAresPorAnio(auth, anio);
      setAres(data || []);
    } catch (err) {
      console.error("Error al cargar AREs:", err);
      setAres([]);
    }
  }, [auth]);

  // 🔹 Cargar ARE por año pero incluyendo un ID específico (para edición)
  const cargarAresPorAnioIncluyendo = useCallback(async (anio, includeId) => {
    try {
      const data = await asignacionZoreAreService.listarAresPorAnioIncluyendo(auth, anio, includeId);
      setAres(data || []);
    } catch (err) {
      console.error("Error al cargar AREs con include:", err);
      setAres([]);
    }
  }, [auth]);

  const crearAsignacion = async (dto) => {
    try {
        const data = await asignacionZoreAreService.crear(auth, dto);
        const message = data?.apiResponse?.mensaje;

        if (data?.apiResponse?.codigo >= 400) 
        return { success: false, message };

        if (data?.asignacionZoreAre) {
        setAsignaciones((prev) => {
            const exists = prev.some((a) => a.id === data.asignacionZoreAre.id);
            if (exists) {
            return prev.map((a) =>
                a.id === data.asignacionZoreAre.id ? data.asignacionZoreAre : a
            );
            }
            return [data.asignacionZoreAre, ...prev];
        });

        setPageInfo((prev) => ({
            ...prev,
            totalElements: prev.totalElements + 1,
        }));
        }

        return { success: true, message };
    } catch (err) {
        console.error(err);
        return { success: false, message: err.message || "Error al crear asignación" };
    }
  };

  // 🔹 Actualizar asignación
  const actualizarAsignacion = async (id, dto) => {
    try {
      const data = await asignacionZoreAreService.actualizar(auth, id, dto);
      const message = data?.apiResponse.mensaje;

      // ✅ Actualización en memoria sin fetch
        if (data?.asignacionZoreAre) {
        setAsignaciones((prev) =>
            prev.map((a) =>
            a.id === id ? data.asignacionZoreAre : a
            )
        );
        }

      return { success: true, message };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message || "Error al actualizar asignación" };
    }
  };

  // 🔹 Efecto inicial
  useEffect(() => {
    if (auth.jwt && user?.rol === "ADMIN") {
      cargarAsignaciones();
      cargarAniosZore();
    }
  }, [auth.jwt, user?.rol, cargarAsignaciones, cargarAniosZore]);

  return (
    <AsignacionZoreAreContext.Provider
      value={{
        asignaciones,
        anios,
        zores,
        ares,
        pageInfo,
        currentPage,
        setCurrentPage,
        loading,
        error,
        cargarAsignaciones,
        cargarAniosZore,
        cargarZoresPorAnio,
        cargarAresPorAnio,
        cargarAresPorAnioIncluyendo,
        crearAsignacion,
        actualizarAsignacion,
      }}
    >
      {children}
    </AsignacionZoreAreContext.Provider>
  );
};
