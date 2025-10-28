//src/context/ContratoProvider.jsx
import { useState, useCallback, useMemo, useEffect } from "react";
import { ContratoContext } from "./ContratoContext";
import { contratoService } from "../services/contratoService";
import { useAuth } from "../hooks/useAuth";

export const ContratoProvider = ({ children, user }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarContratos = useCallback(async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const data = await contratoService.listar(auth, page, size);
      setContratos(data.content || data); // `content` si es Page<Contrato>
      setError(null);
    } catch (err) {
      console.error(err);
      const message = err?.mensaje || err?.message || "Error al cargar contratos";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const crearContrato = async (dto) => {
    if (!["ADMIN", "RRHH"].includes(user?.rol)) return { success: false, message: "Acceso denegado" };
    try {
      const data = await contratoService.crear(auth, dto);
      const message = data?.apiResponse?.mensaje || "Contrato creado correctamente";
      if (data?.contrato) setContratos((prev) => [...prev, data.contrato]);
      return { success: true, message };
    } catch (err) {
      console.error(err);
      return { success: false, message: err?.message || "Error al crear contrato" };
    }
  };

  const actualizarContrato = async (id, dto) => {
    if (!["ADMIN", "RRHH"].includes(user?.rol)) return { success: false, message: "Acceso denegado" };
    try {
      await contratoService.actualizar(auth, id, dto);
      setContratos((prev) => prev.map((c) => (c.id === id ? { ...c, ...dto } : c)));
      return { success: true, message: "Contrato actualizado correctamente" };
    } catch (err) {
      console.error(err);
      return { success: false, message: err?.message || "Error al actualizar contrato" };
    }
  };

  const eliminarContrato = async (id) => {
    if (!["ADMIN", "RRHH"].includes(user?.rol)) return { success: false, message: "Acceso denegado" };
    try {
      await contratoService.eliminar(auth, id);
      setContratos((prev) => prev.filter((c) => c.id !== id));
      return { success: true, message: "Contrato eliminado correctamente" };
    } catch (err) {
      console.error(err);
      return { success: false, message: err?.message || "Error al eliminar contrato" };
    }
  };

  useEffect(() => {
    if (auth.jwt && ["ADMIN", "RRHH"].includes(user?.rol)) {
      cargarContratos();
    }
  }, [auth.jwt, user?.rol, cargarContratos]);

  return (
    <ContratoContext.Provider
      value={{
        contratos,
        loading,
        error,
        cargarContratos,
        crearContrato,
        actualizarContrato,
        eliminarContrato,
      }}
    >
      {children}
    </ContratoContext.Provider>
  );
};
