// src/context/LocalidadProvider.jsx
import { useState, useCallback, useMemo, useEffect } from "react";
import { LocalidadContext } from "./LocalidadContext";
import { localidadService } from "../services/localidadService";
import { useAuth } from "../hooks/useAuth";

export const LocalidadProvider = ({ children, user }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Control de paginación interna (invisible al usuario)
  const [page, setPage] = useState(0);
  const [size] = useState(10); // 🔸 Control interno del tamaño (no editable por el usuario)
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 📦 Cargar todas las localidades
  // 📦 Cargar localidades con paginación
  const cargarLocalidades = useCallback(
    async (pagina = page) => {
      setLoading(true);
      try {
        const data = await localidadService.listarPaginadas(auth, pagina, size);
        console.log("📦 Localidades paginadas:", data);

        // Si el backend devuelve un Page<LocalidadResponse>
        setLocalidades(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setError(null);
      } catch (err) {
        console.error(err);
        const message = err.mensaje || err.message || "Error al cargar localidades";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [auth, size, page]
  );

  // 🏗️ Crear localidad
  const crearLocalidad = async (dto) => {
    if (user?.rol !== "ADMIN") {
      return { success: false, message: "Acceso denegado" };
    }

    try {
      const data = await localidadService.crear(auth, dto);
      const mensaje = data?.response?.mensaje || "Localidad creada correctamente";
      const codigo = data?.response?.codigo || 200;

      if (codigo >= 400) {
        return { success: false, message: mensaje };
      }

      if (data?.localidad) {
        setLocalidades((prev) => [...prev, data.localidad]);
      }

      return { success: true, message: mensaje };
    } catch (err) {
      console.error(err);
      const message = err?.mensaje || err?.message || "Error al crear localidad";
      return { success: false, message };
    }
  };

  // ✏️ Actualizar localidad
  const actualizarLocalidad = async (id, dto) => {
    if (user?.rol !== "ADMIN") {
      return { success: false, message: "Acceso denegado" };
    }

    try {
      const data = await localidadService.actualizar(auth, id, dto);
      const mensaje = data?.response?.mensaje || "Localidad actualizada correctamente";
      const codigo = data?.response?.codigo || 200;

      if (codigo >= 400) {
        return { success: false, message: mensaje };
      }

      if (data?.localidad) {
        setLocalidades((prev) => {
          const idx = prev.findIndex((l) => l.id === id);
          if (idx === -1) return [...prev, data.localidad];
          const updated = [...prev];
          updated[idx] = data.localidad;
          return updated;
        });
      }

      return { success: true, message: mensaje };
    } catch (err) {
      console.error(err);
      const message = err?.mensaje || err?.message || "Error al actualizar localidad";
      return { success: false, message };
    }
  };

  // 🗑️ Eliminar localidad
  const eliminarLocalidad = async (id) => {
    if (user?.rol !== "ADMIN")
      return { success: false, message: "Acceso denegado" };

    try {
      const data = await localidadService.eliminar(auth, id);
      const codigo = data?.codigo || 200;
      const mensaje = data?.mensaje || "Localidad eliminada correctamente";

      if (codigo >= 400) {
        return { success: false, message: mensaje };
      }

      setLocalidades((prev) => prev.filter((l) => l.id !== id));
      return { success: true, message: mensaje };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message || "Error al eliminar localidad" };
    }
  };

  // 🔁 Recargar al montar o cambiar página
  useEffect(() => {
    if (auth.jwt && user?.rol === "ADMIN") {
      cargarLocalidades(page);
    }
  }, [auth.jwt, user?.rol, page, cargarLocalidades]);

  return (
    <LocalidadContext.Provider
      value={{
        localidades,
        loading,
        error,
        totalPages,
        totalElements,
        page,
        setPage, // útil si luego quieres agregar botones de paginación
        cargarLocalidades,
        crearLocalidad,
        actualizarLocalidad,
        eliminarLocalidad,
      }}
    >
      {children}
    </LocalidadContext.Provider>
  );
};
