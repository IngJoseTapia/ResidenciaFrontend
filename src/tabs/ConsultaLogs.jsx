// src/tabs/ConsultaLogs.jsx
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import "../styles/ConsultaLogs.css";
import Pagination from "../components/Pagination";
import { useLogsSistema } from "../hooks/useLogsSistema"; // Hook genérico para todos los logs

const ConsultaLogs = () => {
  const { logs, loading, error, fetchLogs, tipoLog, setTipoLog, pageInfo } = useLogsSistema();
  const { page, totalPages } = pageInfo;

  /** 🔹 Cargar datos al montar o al cambiar tipo de log */
 useEffect(() => {
    fetchLogs(tipoLog, 0);
  }, [fetchLogs, tipoLog]);

  /** 🔹 Cambiar página */
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchLogs(tipoLog, newPage);
    }
  };

  /** 🔹 Columnas dinámicas según tipo de log */
  const getColumns = () => {
    switch (tipoLog) {
      case "login":
      case "sistema":
        return ["ID", "Usuario", "Rol", "Fecha/Hora", "Sitio", "Resultado", "Tipo Evento", "IP", "Descripción"];
      case "correos":
        return ["ID", "Usuario Afectado", "Correo Destino", "Tipo Evento", "Asunto", "Contenido", "Fecha/Hora"];
      default:
        return [];
    }
  };

  return (
    <div className="consulta-logs-container">
      <h2 className="consulta-logs-title">Consulta General de Logs</h2>

      {/* 🔹 Barra de selección */}
      <div className="logs-button-bar">
        <button disabled={loading} className={tipoLog === "login" ? "active" : ""} onClick={() => setTipoLog("login")}>Login</button>
        <button disabled={loading} className={tipoLog === "sistema" ? "active" : ""} onClick={() => setTipoLog("sistema")}>Sistema</button>
        <button disabled={loading} className={tipoLog === "correos" ? "active" : ""} onClick={() => setTipoLog("correos")}>Correos</button>
      </div>

      {/* 🔹 Cargando */}
      {loading && (
        <div className="logs-loading">
          <FaSpinner className="logs-spinner" /> Cargando logs...
        </div>
      )}

      {/* 🔹 Error */}
      {error && !loading && logs.length === 0 && (
        <div className="logs-error">⚠️ Error al cargar los logs: {error}</div>
      )}

      {/* 🔹 Tabla */}
      {!loading && !error && (
        <div className="logs-table-container">
          <table className="logs-table">
            <thead>
              <tr>{getColumns().map((col) => <th key={col}>{col}</th>)}</tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={getColumns().length} className="no-data">
                    No hay registros para mostrar
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    {tipoLog === "login" || tipoLog === "sistema" ? (
                      <>
                        <td>{log.id}</td>
                        <td>{log.correo}</td>
                        <td>{log.rol || "N/A"}</td>
                        <td>{log.fechaActividad ? new Date(log.fechaActividad).toLocaleString("es-MX") : "—"}</td>
                        <td>{log.sitio}</td>
                        <td>{log.resultado || "N/A"}</td>
                        <td>{log.tipoEvento}</td>
                        <td>{log.ip || "N/A"}</td>
                        <td>{log.descripcion || "N/A"}</td>
                      </>
                    ) : (
                      <>
                        <td>{log.id}</td>
                        <td>{log.idUsuario || "N/A"}</td>
                        <td>{log.correoDestinatario}</td>
                        <td>{log.tipoEvento}</td>
                        <td>{log.asunto}</td>
                        <td>{log.cuerpo}</td>
                        <td>{log.fechaEnvio ? new Date(log.fechaEnvio).toLocaleString("es-MX") : "—"}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Paginación */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrev={() => handlePageChange(page - 1)}
        onNext={() => handlePageChange(page + 1)}
      />
    </div>
  );
};

export default ConsultaLogs;
