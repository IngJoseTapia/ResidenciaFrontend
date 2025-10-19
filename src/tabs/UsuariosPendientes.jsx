// src/tabs/UsuariosPendientes.jsx
import React, { useEffect, useState } from "react";
import { FaSpinner, FaUserCheck } from "react-icons/fa";
import Pagination from "../components/Pagination";
import "../styles/UsuariosPendientes.css";
import { useAsignacion } from "../hooks/useAsignacion";
import { useVocalia } from "../hooks/useVocalia";
import { useUser } from "../hooks/useUser";

const UsuariosPendientes = () => {
  const { user, loadingUser } = useUser();
  // 🔹 Hooks personalizados
  const {
    usuariosPendientes,
    pageInfo,
    fetchUsuariosPendientes,
    asignarVocaliaAUsuario,
    loading,
    error,
  } = useAsignacion();

  const { vocalias, cargarVocalias, loading: loadingVocalias, error: errorVocalias } = useVocalia();

  // 🔹 Estados locales
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedVocalia, setSelectedVocalia] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");
  const [loadingAssign, setLoadingAssign] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  // 🔹 Cargar datos al montar el componente o cambiar de página
  useEffect(() => {
    fetchUsuariosPendientes(currentPage, pageSize);
    cargarVocalias();
  }, [currentPage, fetchUsuariosPendientes, cargarVocalias]);

  // 🔹 Handlers
  const handleAsignarClick = (usuario) => {
    setSelectedUsuario(usuario);
    setSelectedVocalia("");
    setModalMessage("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUsuario(null);
    setSelectedVocalia("");
    setModalMessage("");
    setModalOpen(false);
  };

  const handleAsignarVocalia = async (e) => {
    e.preventDefault();
    if (!selectedVocalia) return;

    setLoadingAssign(true);
    setModalMessage("Procesando...");
    setModalMessageType("info");

    try {
      const res = await asignarVocaliaAUsuario(selectedUsuario.id, selectedVocalia);

      setModalMessage(res?.mensaje || "Vocalía asignada correctamente");
      setModalMessageType("success");

      setTimeout(() => handleCloseModal(), 5000);
    } catch (err) {
      setModalMessage(err.message || "Error al asignar vocalía");
      setModalMessageType("error");
    } finally {
      setLoadingAssign(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pageInfo.totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  if (loadingUser) return <p className="loading-text">Verificando usuario...</p>;
  if (!user || user.rol !== "ADMIN")
    return <p className="error-text">⛔ Acceso denegado. Solo administradores pueden acceder a este módulo.</p>;

  // 🔹 Estados de carga globales
  if (loading || loadingVocalias)
    return <p className="loading-text">Cargando información...</p>;

  if (error || errorVocalias)
    return <p className="error-text">{error || errorVocalias}</p>;

  return (
    <div className="usuarios-container">
      <h2 className="usuarios-title">Usuarios Pendientes</h2>

      {usuariosPendientes.length === 0 ? (
        <p className="empty-text">No hay usuarios pendientes por asignar.</p>
      ) : (
        <>
          <div className="usuarios-form-table">
            <table className="usuarios-tab-table">
              <thead>
                <tr>
                  <th>Correo</th>
                  <th>Nombre</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>Fecha de Registro</th>
                  <th>Status</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPendientes.map((u) => (
                  <tr key={u.id}>
                    <td>{u.correo}</td>
                    <td>{u.nombre}</td>
                    <td>{u.apellidoPaterno}</td>
                    <td>{u.apellidoMaterno}</td>
                    <td>{new Date(u.fechaRegistro).toLocaleDateString()}</td>
                    <td>{u.status}</td>
                    <td className="action-cell">
                      <button
                        className="btn-icon edit"
                        onClick={() => handleAsignarClick(u)}
                      >
                        <FaUserCheck />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Controles de paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={pageInfo.totalPages}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />
        </>
      )}

      {/* 🔹 Modal de asignación */}
      {modalOpen && selectedUsuario && (
        <div className="modal">
          <div className="modal-content edit">
            <h3 className="modal-title">Asignar Vocalía</h3>

            <form onSubmit={handleAsignarVocalia} className="modal-form">
              <div className="modal-form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  value={`${selectedUsuario.nombre} ${selectedUsuario.apellidoPaterno} ${selectedUsuario.apellidoMaterno}`}
                  disabled
                />
              </div>

              <div className="modal-form-group">
                <label>Vocalía</label>
                <select
                  value={selectedVocalia}
                  onChange={(e) => setSelectedVocalia(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar vocalía --</option>
                  {vocalias.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nombreCompleto}
                    </option>
                  ))}
                </select>
              </div>

              {modalMessage && (
                <div className={`form-message-modal ${modalMessageType}`}>
                  {modalMessage}
                </div>
              )}

              <div className="modal-buttons">
                <button type="submit" className="btn-guardar" disabled={loadingAssign}>
                  {loadingAssign ? (
                    <>
                      <FaSpinner className="spinner" /> Procesando...
                    </>
                  ) : (
                    "Asignar"
                  )}
                </button>
                <button type="button" className="btn-cancelar" onClick={handleCloseModal}>
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPendientes;
