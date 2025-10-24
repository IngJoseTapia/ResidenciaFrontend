// src/tabs/ConsultaUsuarios.jsx
import { useEffect, useState } from "react";
import { FaSpinner, FaUserCheck } from "react-icons/fa";
import "../styles/ConsultaUsuarios.css";
import Pagination from "../components/Pagination";
import { useConsultaUsuarios } from "../hooks/useConsultaUsuarios";

const ConsultaUsuarios = () => {
  const {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    eliminarUsuario,
    pageInfo: { page, totalPages },
  } = useConsultaUsuarios();

  // 🔹 Estado del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  // 🔹 Estado del modal de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  /** 🔹 Cargar datos de la primera página al montar el componente */
  useEffect(() => {
    fetchUsuarios(0);
  }, [fetchUsuarios]);

  /** 🔹 Navegar entre páginas */
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchUsuarios(newPage);
    }
  };

  /** 🔹 Abrir modal */
  const handleOpenModal = (usuario) => {
    setSelectedUsuario(usuario);
    setModalMessage("");
    setModalMessageType("");
    setModalOpen(true);
  };

  /** 🔹 Cerrar modal */
  const handleCloseModal = () => {
    setSelectedUsuario(null);
    setModalMessage("");
    setModalMessageType("");
    setModalOpen(false);
  };

  /** 🔹 Confirmación antes de eliminar */
  const handleConfirmDelete = (usuario) => {
    setUsuarioToDelete(usuario);
    setConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setUsuarioToDelete(null);
    setConfirmOpen(false);
  };

  /** 🔹 Confirmar eliminación */
  const confirmDelete = async () => {
    if (!usuarioToDelete) return;

    setConfirmOpen(false);
    setLoadingDelete(true);
    setModalMessage("Eliminando usuario...");
    setModalMessageType("info");

    try {
      const msg = await eliminarUsuario(usuarioToDelete.id);

      // Mensaje de éxito
      setModalMessage(msg);
      setModalMessageType("success");

      // Cerrar después de 6s
      setTimeout(() => {
        setModalMessage("");
        handleCloseModal();
      }, 6000);
    } catch (err) {
      setModalMessage(err.message || "Error al eliminar usuario");
      setModalMessageType("error");
      setTimeout(() => setModalMessage(""), 8000);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="consulta-usuarios-container">
      <h2 className="consulta-usuarios-title">Consulta General de Usuarios</h2>

      {/* 🔹 Cargando */}
      {loading && (
        <div className="consulta-loading">
          <FaSpinner className="consulta-spinner" /> Cargando usuarios...
        </div>
      )}

      {/* 🔹 Error */}
      {error && !loading && usuarios.length === 0 && (
        <div className="consulta-error">
          ⚠️ Error al cargar los usuarios: {error}
        </div>
      )}

      {/* 🔹 Tabla */}
      {!loading && !error && (
        <div className="consulta-form-table">
          <table className="consulta-usuarios-table">
            <thead>
              <tr>
                <th>Correo</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Rol</th>
                <th>Status</th>
                <th>Teléfono</th>
                <th>Género</th>
                <th>Fecha Registro</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    No hay usuarios registrados en el sistema
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.correo}</td>
                    <td>{u.nombre}</td>
                    <td>{u.apellidoPaterno}</td>
                    <td>{u.apellidoMaterno}</td>
                    <td>{u.rol}</td>
                    <td>{u.status}</td>
                    <td>{u.telefono || "N/A"}</td>
                    <td>{u.genero || "N/A"}</td>
                    <td>
                      {new Date(u.fechaRegistro).toLocaleDateString("es-MX")}
                    </td>
                    <td className="action-cell">
                      <button
                        className="btn-icon action"
                        onClick={() => handleOpenModal(u)}
                      >
                        <FaUserCheck />
                      </button>
                    </td>
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

      {/* 🔹 Modal eliminar */}
      {modalOpen && selectedUsuario && (
        <div className="modal">
          <div className="modal-content edit">
            <h3 className="modal-title">Eliminar Usuario</h3>

            <div className="modal-form">
              <div className="modal-form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  value={`${selectedUsuario.nombre} ${selectedUsuario.apellidoPaterno} ${selectedUsuario.apellidoMaterno}`}
                  disabled
                />
              </div>

              {modalMessage && (
                <div className={`form-message-modal ${modalMessageType}`}>
                  {modalMessage}
                </div>
              )}

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={() => handleConfirmDelete(selectedUsuario)}
                  disabled={loadingDelete}
                >
                  {loadingDelete ? (
                    <>
                      <FaSpinner className="spinner" /> Procesando...
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </button>

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Confirmación */}
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
                    Eliminando... <FaSpinner className="spinner" />
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

export default ConsultaUsuarios;
