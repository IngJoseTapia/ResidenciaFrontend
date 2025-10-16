// src/context/VocaliaProvider.jsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { VocaliaContext } from "./VocaliaContext";
import { vocaliaService } from "../services/vocaliaService";
import { useAuth } from "../hooks/useAuth";

export const VocaliaProvider = ({ children }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [vocalias, setVocalias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarVocalias = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vocaliaService.listar(auth);
      setVocalias(data);
      setError(null);
    } catch (err) {
      console.error(err);
      // Si el backend devuelve un objeto con mensaje, úsalo
      const message = err.mensaje || err.message || "Error al cargar vocalías";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const crearVocalia = async (dto) => {
    try {
      const data = await vocaliaService.crear(auth, dto);

      // Obtenemos el mensaje de ApiResponse
      const message = data?.apiResponse?.mensaje || "Vocalía creada correctamente";
      const codigo = data?.apiResponse?.codigo || 200;

      if (codigo >= 400) {
        return { success: false, message };
      }

      // 🔹 Actualizamos el estado con la vocalía recién creada
      if (data?.vocalia) {
        setVocalias((prev) => [...prev, data.vocalia]);
      }

      return { success: true, message };
    } catch (err) {
      console.error(err);
      const message = err?.message || "Error inesperado al crear vocalía";
      return { success: false, message };
    }
  };

  const actualizarVocalia = async (id, dto) => {
    try {
      const data = await vocaliaService.actualizar(auth, id, dto);

      if (data.codigo && data.codigo >= 400) {
        return { success: false, message: data.mensaje || "Error al actualizar vocalía" };
      }

      setVocalias((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...dto } : v))
      );
      return { success: true, message: data.mensaje || "Vocalía actualizada correctamente" };
    } catch (err) {
      console.error(err);
      const message = err.mensaje || err.message || "Error al actualizar vocalía";
      return { success: false, message };
    }
  };

  const eliminarVocalia = async (id) => {
    try {
      const data = await vocaliaService.eliminar(auth, id);

      if (data.codigo && data.codigo >= 400) {
        return { success: false, message: data.mensaje || "Error al eliminar vocalía" };
      }

      setVocalias((prev) => prev.filter((v) => v.id !== id));
      return { success: true, message: data.mensaje || "Vocalía eliminada correctamente" };
    } catch (err) {
      console.error(err);
      const message = err.mensaje || err.message || "Error al eliminar vocalía";
      return { success: false, message };
    }
  };

  useEffect(() => {
    if (auth.jwt) {
      cargarVocalias();
    }
  }, [auth.jwt, cargarVocalias]);

  return (
    <VocaliaContext.Provider
      value={{
        vocalias,
        loading,
        error,
        cargarVocalias,
        crearVocalia,
        actualizarVocalia,
        eliminarVocalia,
      }}
    >
      {children}
    </VocaliaContext.Provider>
  );
};
