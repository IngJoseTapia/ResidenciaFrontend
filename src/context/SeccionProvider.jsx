//src/context/SeccionProvider.jsx
import { useState, useCallback, useEffect, useMemo } from "react";
import { SeccionContext } from "./SeccionContext";
import { seccionService } from "../services/seccionService";
import { asignacionZoreAreService } from "../services/asignacionZoreAreService";
import { municipioService } from "../services/municipioService"; 
import { useAuth } from "../hooks/useAuth";

export const SeccionProvider = ({ children, user }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [secciones, setSecciones] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [aniosZore, setAniosZore] = useState([]);
  const [asignacionesPorAnio, setAsignacionesPorAnio] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const PAGE_SIZE = 10;

  const cargarAniosZore = useCallback(async () => {
    try {
        const data = await asignacionZoreAreService.listarAniosZore(auth);
        setAniosZore(data || []);
    } catch (err) {
        console.error("Error al cargar años ZORE:", err);
        setAniosZore([]);
    }
  }, [auth]);

  // 🔹 Cargar asignaciones Zore-Are por año seleccionado
  const cargarAsignacionesPorAnio = useCallback(async (anioSeleccionado) => {
    if (!anioSeleccionado) {
        setAsignacionesPorAnio([]);
        return;
    }

    try {
        const data = await seccionService.listarAsignacionesPorAnio(auth, anioSeleccionado);
        setAsignacionesPorAnio(data || []);
    } catch (err) {
        console.error("Error al cargar asignaciones por año:", err);
        setAsignacionesPorAnio([]);
    }
  }, [auth]);

  // 🔹 Cargar municipios (solo para listar)
  const cargarMunicipios = useCallback(async () => {
    try {
      const data = await municipioService.listar(auth);
      setMunicipios(data || []);
    } catch (err) {
      console.error("Error al cargar municipios:", err);
      setMunicipios([]);
    }
  }, [auth]);

  // 🔹 Cargar localidades filtradas por municipio
  const cargarLocalidadesPorMunicipio = useCallback(async (municipioId) => {
    if (!municipioId) {
        setLocalidades([]);
        return;
    }

    try {
        const data = await seccionService.listarLocalidadesPorMunicipio(auth, municipioId);
        setLocalidades(data || []);
    } catch (err) {
        console.error("Error al cargar localidades por municipio:", err);
        setLocalidades([]);
    }
  }, [auth]);

  // 🔹 Cargar secciones con paginación
  const cargarSecciones = useCallback(async (page = currentPage, size = PAGE_SIZE) => {
    if (user?.rol !== "ADMIN") {
      setError("Acceso denegado: solo los administradores pueden ver esta información.");
      setSecciones([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await seccionService.listarPaginadas(auth, page, size);
      setSecciones(data.content || []);
      setPageInfo({
        page: data.number,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      console.error("Error al cargar secciones:", err);
      setError(err.message || "Error al cargar secciones");
    } finally {
      setLoading(false);
    }
  }, [auth, user, currentPage]);

  // 🔹 Cargar todas las localidades (para los selects)
  const cargarLocalidades = useCallback(async () => {
    try {
      const data = await seccionService.listarLocalidades(auth);
      setLocalidades(data || []);
    } catch (err) {
      console.error("Error al cargar localidades:", err);
      setLocalidades([]);
    }
  }, [auth]);

  // 🔹 Crear una nueva sección
  const crearSeccion = async (dto) => {
    try {
      const data = await seccionService.crear(auth, dto);
      const message = data?.response?.mensaje;
      const codigo = data?.response?.codigo;

      if (codigo >= 400)
        return { success: false, message };

      if (data?.seccion) {
        setSecciones((prev) => [data.seccion, ...prev]);
        setPageInfo((prev) => ({
          ...prev,
          totalElements: prev.totalElements + 1,
        }));
      }

      return { success: true, message };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message || "Error al crear sección" };
    }
  };

  // 🔹 Actualizar una sección existente
  const actualizarSeccion = async (id, dto) => {
    try {
      const data = await seccionService.actualizar(auth, id, dto);
      const message = data?.response?.mensaje;

      if (data?.seccion) {
        setSecciones((prev) =>
          prev.map((s) => (s.id === id ? data.seccion : s))
        );
      }

      return { success: true, message };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message || "Error al actualizar sección" };
    }
  };

  // 🔹 Efecto inicial
  useEffect(() => {
    if (auth.jwt && user?.rol === "ADMIN") {
      cargarSecciones();
      cargarAniosZore();
      cargarMunicipios();
    }
  }, [auth.jwt, user?.rol, cargarSecciones, cargarAniosZore, cargarMunicipios]);

  return (
    <SeccionContext.Provider
        value={{
            secciones,
            localidades,
            setLocalidades,
            municipios,
            aniosZore,
            asignacionesPorAnio,       // ✅ nuevo
            page: pageInfo.page,          // ✅ renombrado
            totalPages: pageInfo.totalPages, // ✅ renombrado
            setPage: setCurrentPage,      // ✅ renombrado
            loading,
            error,
            cargarSecciones,
            cargarLocalidades,
            cargarMunicipios,
            cargarAniosZore,
            cargarAsignacionesPorAnio, // ✅ nuevo
            cargarLocalidadesPorMunicipio,
            crearSeccion,
            actualizarSeccion,
        }}
    >
      {children}
    </SeccionContext.Provider>
  );
};
