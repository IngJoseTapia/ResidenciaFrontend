// src/context/UsuarioContratoProvider.jsx
import { useState, useCallback, useMemo, useEffect } from "react";
import { UsuarioContratoContext } from "./UsuarioContratoContext";
import { usuarioContratoService } from "../services/usuarioContratoService";
import { useAuth } from "../hooks/useAuth";

export const UsuarioContratoProvider = ({ children, user }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [usuarioContratos, setUsuarioContratos] = useState([]);
  const [usuariosActivos, setUsuariosActivos] = useState([]);
  const [contratosActivos, setContratosActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(0);

  // 🔹 Cargar vínculos paginados
  const cargarUsuarioContratos = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const data = await usuarioContratoService.listarPaginado(auth, page);
      setUsuarioContratos(data.content || []);
      setPagina(page);
      setError(null);
    } catch (err) {
      console.error(err);
      const message = err.mensaje || err.message || "Error al cargar vínculos usuario-contrato";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  // 🔹 Cargar usuarios activos
  const cargarUsuariosActivos = useCallback(async () => {
    try {
      const data = await usuarioContratoService.listarUsuariosActivos(auth);
      setUsuariosActivos(data || []);
    } catch (err) {
      console.error("Error al cargar usuarios activos:", err);
      setUsuariosActivos([]);
    }
  }, [auth]);

  // 🔹 Cargar contratos activos
  const cargarContratosActivos = useCallback(async () => {
    try {
      const data = await usuarioContratoService.listarContratosActivos(auth);
      setContratosActivos(data || []);
    } catch (err) {
      console.error("Error al cargar contratos activos:", err);
      setContratosActivos([]);
    }
  }, [auth]);

  // 🔹 Crear una nueva asignación
  const asignarContrato = async (dto) => {
    try {
      const data = await usuarioContratoService.asignar(auth, dto);
      const message = data?.apiResponse?.mensaje || "Contrato asignado correctamente";

      if (data?.apiResponse?.codigo >= 400) {
        return { success: false, message };
      }

      if (data?.usuarioContrato) {
        const uc = data.usuarioContrato;

        const nuevoUsuario = usuariosActivos.find(u => u.id === Number(dto.usuarioId));
        const nuevoContrato = contratosActivos.find(c => c.id === Number(dto.contratoId));

        const enriched = {
          ...uc,
          usuario: nuevoUsuario
            ? { id: nuevoUsuario.id, nombreCompleto: nuevoUsuario.nombreCompleto }
            : uc.usuario,
          contrato: nuevoContrato
            ? { id: nuevoContrato.id, puesto: nuevoContrato.puesto }
            : uc.contrato,
          status: uc.estado || dto.status || "INDEFINIDO",
        };

        setUsuarioContratos((prev) => [...prev, enriched]);
      }

      return { success: true, message };
    } catch (err) {
      console.error(err);
      const message = err.mensaje || err.message || "Error al asignar contrato";
      return { success: false, message };
    }
  };

  // 🔹 Actualizar vínculo existente
  const actualizarUsuarioContrato = async (id, dto) => {
    try {
      const data = await usuarioContratoService.actualizar(auth, id, dto);
      const message = data?.mensaje || "Vínculo actualizado correctamente";

      if (data?.codigo >= 400) return { success: false, message };

      setUsuarioContratos((prev) =>
        prev.map((uc) => {
          if (uc.id !== id) return uc;

          const nuevoUsuario = usuariosActivos.find(u => u.id === Number(dto.usuarioId));
          const nuevoContrato = contratosActivos.find(c => c.id === Number(dto.contratoId));

          return {
            ...uc,
            usuario: nuevoUsuario ? {
              id: nuevoUsuario.id,
              nombreCompleto: nuevoUsuario.nombreCompleto
            } : uc.usuario,
            contrato: nuevoContrato ? {
              id: nuevoContrato.id,
              puesto: nuevoContrato.puesto
            } : uc.contrato,
            numeroContrato: dto.numeroContrato,
            status: dto.status,
            observaciones: dto.observaciones
          };
        })
      );

      return { success: true, message };
    } catch (err) {
      console.error(err);
      const message = err.mensaje || err.message || "Error al actualizar vínculo";
      return { success: false, message };
    }
  };

  // 🔹 Efecto para cargar datos iniciales
  useEffect(() => {
    if (auth.jwt && ["ADMIN", "RRHH"].includes(user?.rol)) {
      cargarUsuarioContratos();
      cargarUsuariosActivos();
      cargarContratosActivos();
    }
  }, [auth.jwt, user?.rol, cargarUsuarioContratos, cargarUsuariosActivos, cargarContratosActivos]);

  return (
    <UsuarioContratoContext.Provider
      value={{
        usuarioContratos,
        usuariosActivos,
        contratosActivos,
        loading,
        error,
        pagina,
        cargarUsuarioContratos,
        cargarUsuariosActivos,
        cargarContratosActivos,
        asignarContrato,
        actualizarUsuarioContrato,
      }}
    >
      {children}
    </UsuarioContratoContext.Provider>
  );
};
