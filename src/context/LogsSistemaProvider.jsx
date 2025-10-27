//src/context/LogsSistemaProvider.jsx
import { useState, useCallback, useMemo } from "react";
import { LogsSistemaContext } from "./LogsSistemaContext";
import { getLogsByTipo } from "../services/logsService";
import { useAuth } from "../hooks/useAuth";

export const LogsSistemaProvider = ({ children }) => {
  const { jwt, refreshJwt, logout } = useAuth();
  const auth = useMemo(() => ({ jwt, refreshJwt, logout }), [jwt, refreshJwt, logout]);

  const [logs, setLogs] = useState([]);
  const [tipoLog, setTipoLog] = useState("sistema"); // "login", "sistema", "correos"
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PAGE_SIZE = 50;

  /**
   * 🔹 Cargar logs por tipo (paginado)
   */
  const fetchLogs = useCallback(
    async (tipo, page = 0) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLogsByTipo(tipo, page, PAGE_SIZE, auth);
        setLogs(data.content || []);
        setPageInfo({
          page: data.number ?? 0,
          totalPages: data.totalPages ?? 0,
          totalElements: data.totalElements ?? 0,
        });
      } catch (err) {
        console.error("Error al cargar logs:", err);
        setError(err.message || "Error al cargar los logs");
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  /**
   * 🔹 Cambiar tipo de log y recargar
   */
  const cambiarTipoLog = useCallback(
    (nuevoTipo) => {
      if (nuevoTipo !== tipoLog) {
        setTipoLog(nuevoTipo);
        fetchLogs(nuevoTipo, 0);
      }
    },
    [tipoLog, fetchLogs]
  );

  return (
    <LogsSistemaContext.Provider
      value={{
        logs,
        tipoLog,
        setTipoLog: cambiarTipoLog,
        pageInfo,
        loading,
        error,
        fetchLogs,
      }}
    >
      {children}
    </LogsSistemaContext.Provider>
  );
};
