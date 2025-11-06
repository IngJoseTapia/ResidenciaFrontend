  //src/context/MunicipioProvider.jsx
  import { useState, useCallback, useMemo, useEffect } from "react";
  import { MunicipioContext } from "./MunicipioContext";
  import { municipioService } from "../services/municipioService";
  import { useAuth } from "../hooks/useAuth";

  export const MunicipioProvider = ({ children, user }) => {
    const { jwt, refreshJwt, logout } = useAuth();
    const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 📦 Cargar municipios
    const cargarMunicipios = useCallback(async () => {
      setLoading(true);
      try {
        const data = await municipioService.listar(auth);
        setMunicipios(data);
        setError(null);
      } catch (err) {
        console.error(err);
        const message = err.mensaje || err.message || "Error al cargar municipios";
        setError(message);
      } finally {
        setLoading(false);
      }
    }, [auth]);

    // 🏗️ Crear municipio (actualizado para leer ApiMunicipioResponse)
    const crearMunicipio = async (dto) => {
      if (user?.rol !== "ADMIN") {
        return { success: false, message: "Acceso denegado" };
      }

      try {
        const data = await municipioService.crear(auth, dto);

        // 🔍 Validar estructura de respuesta
        const mensaje = data?.apiResponse?.mensaje || "Municipio creado correctamente";
        const codigo = data?.apiResponse?.codigo || 200;

        if (codigo >= 400) {
          return { success: false, message: mensaje };
        }

        // ✅ Agregar municipio recién creado a la tabla (sin refresh)
        if (data?.municipio) {
          setMunicipios((prev) => [...prev, data.municipio]);
        }

        return { success: true, message: mensaje };
      } catch (err) {
        console.error(err);
        const message = err?.mensaje || err?.message || "Error al crear municipio";
        return { success: false, message };
      }
    };

    // ✏️ Actualizar municipio
    const actualizarMunicipio = async (id, dto) => {
      if (user?.rol !== "ADMIN") {
        return { success: false, message: "Acceso denegado" };
      }

      try {
        const data = await municipioService.actualizar(auth, id, dto);

        // Leer la estructura de ApiMunicipioResponse
        const mensaje = data?.apiResponse?.mensaje || "Municipio actualizado correctamente";
        const codigo = data?.apiResponse?.codigo || 200;

        if (codigo >= 400) {
          return { success: false, message: mensaje };
        }

        // ✅ Actualizar el registro en el estado local
        if (data?.municipio) {
          setMunicipios((prev) => {
            const idx = prev.findIndex((m) => m.id === id);
            if (idx === -1) {
              // Si no existe el anterior, lo agregamos al final (fallback)
              return [...prev, data.municipio];
            }

            const updated = [...prev];
            updated.splice(idx, 1, data.municipio); // reemplaza en la misma posición
            return updated;
          });
        }

        return { success: true, message: mensaje };
      } catch (err) {
        console.error(err);
        const message = err?.mensaje || err?.message || "Error al actualizar municipio";
        return { success: false, message };
      }
    };

    // 🗑️ Eliminar municipio
    const eliminarMunicipio = async (id) => {
      if (user?.rol !== "ADMIN")
        return { success: false, message: "Acceso denegado" };

      try {
        const data = await municipioService.eliminar(auth, id);

        if (data.codigo && data.codigo >= 400) {
          return { success: false, message: data.mensaje || "Error al eliminar municipio" };
        }

        setMunicipios((prev) => prev.filter((m) => m.id !== id));
        return { success: true, message: data.mensaje || "Municipio eliminado correctamente" };
      } catch (err) {
        console.error(err);
        return { success: false, message: err.message || "Error al eliminar municipio" };
      }
    };

    // 🔁 Efecto inicial
    useEffect(() => {
      if (auth.jwt && user?.rol === "ADMIN") {
        cargarMunicipios();
      }
    }, [auth.jwt, user?.rol, cargarMunicipios]);

    return (
      <MunicipioContext.Provider
        value={{
          municipios,
          loading,
          error,
          cargarMunicipios,
          crearMunicipio,
          actualizarMunicipio,
          eliminarMunicipio,
        }}
      >
        {children}
      </MunicipioContext.Provider>
    );
  };
