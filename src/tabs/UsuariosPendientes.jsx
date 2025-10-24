// src/tabs/UsuariosPendientes.jsx
import { useEffect, useState } from "react";
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
    eliminarUsuarioPendientes,
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
  const [loadingDelete, setLoadingDelete] = useState(false);

  // 🔹 Estados para el modal de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

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

  /** 🔹 Abre el modal de confirmación */
  const handleConfirmDelete = (usuario) => {
    setUsuarioToDelete(usuario);
    setConfirmOpen(true);
  };

  /** 🔹 Cancela el modal de confirmación */
  const handleCancelConfirm = () => {
    setUsuarioToDelete(null);
    setConfirmOpen(false);
  };

  /** 🔹 Confirmar eliminación */
  const confirmDelete = async () => {
    if (!usuarioToDelete) return;

    // 🔹 Cerrar el modal de confirmación inmediatamente
    setConfirmOpen(false);

    setLoadingDelete(true);
    setModalMessage("Eliminando usuario...");
    setModalMessageType("info");

    try {
      const res = await eliminarUsuarioPendientes(usuarioToDelete.id);

      setModalMessage(res?.mensaje || "Usuario eliminado correctamente");
      setModalMessageType("success");

      // 🔹 Actualizamos la lista
      fetchUsuariosPendientes(currentPage, pageSize);

      // 🔹 Ocultar mensaje y cerrar modal después
      setTimeout(() => setModalMessage(""), 5000);
      setTimeout(() => handleCloseModal(), 6000);
    } catch (err) {
      setModalMessage(err.message || "Error al eliminar usuario");
      setModalMessageType("error");
      setTimeout(() => setModalMessage(""), 10000);
    } finally {
      setLoadingDelete(false);
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

      {/* 🔹 Modal principal */}
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
                <button
                  type="submit"
                  className="btn-guardar"
                  disabled={loadingAssign}
                >
                  {loadingAssign ? (
                    <>
                      <FaSpinner className="spinner" /> Procesando...
                    </>
                  ) : (
                    "Asignar"
                  )}
                </button>

                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={() => handleConfirmDelete(selectedUsuario)}
                  disabled={loadingDelete}
                >
                  Eliminar Usuario
                </button>

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Modal de confirmación */}
      {confirmOpen && usuarioToDelete && (
        <div className="modal">
          <div className="modal-content confirm">
            <h3>¿Eliminar Usuario?</h3>
            <p>
              ¿Seguro que deseas eliminar al usuario{" "}
              <strong>{usuarioToDelete.nombre}</strong>?
            </p>
            <div className="confirm-buttons">
              <button
                className="btn-cancelar"
                onClick={handleCancelConfirm}
                disabled={loadingDelete}
              >
                Cancelar
              </button>
              <button
                className="btn-eliminar"
                onClick={confirmDelete}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <>
                    <FaSpinner className="spinner" /> Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPendientes;
