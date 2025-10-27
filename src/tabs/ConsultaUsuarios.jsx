// src/tabs/ConsultaUsuarios.jsx
import { useEffect, useState } from "react";
import { FaSpinner, FaUserCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/ConsultaUsuarios.css";
import Pagination from "../components/Pagination";
import { useConsultaUsuarios } from "../hooks/useConsultaUsuarios";

const ConsultaUsuarios = () => {
  const {
    usuarios,
    setUsuarios,
    loading,
    error,
    fetchUsuarios,
    eliminarUsuario,
    actualizarCorreoUsuario,
    actualizarContrasenaUsuario,
    actualizarStatusUsuario,
    pageInfo: { page, totalPages },
  } = useConsultaUsuarios();

  // 🔹 Estado del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [correo, setCorreo] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [generandoContrasena, setGenerandoContrasena] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
  const [confirmEmailOpen, setConfirmEmailOpen] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Estado del modal de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);

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

  // 🔹 Mostrar mensaje con temporizador (éxito = 5 s + cerrar modal, error = 10 s)
  const showTimedMessage = (type, message) => {
    setModalMessage(message);
    setModalMessageType(type);

    if (type === "success") {
      setTimeout(() => {
        setModalMessage("");
        setModalMessageType("");
        // cerrar 1 segundo después de limpiar mensaje
        setTimeout(() => handleCloseModal(), 1000);
      }, 5000);
    } else if (type === "error") {
      setTimeout(() => {
        setModalMessage("");
        setModalMessageType("");
      }, 10000);
    }
  };

  /** 🔹 Abrir modal */
  const handleOpenModal = (usuario) => {
    setSelectedUsuario(usuario);
    setCorreo(usuario.correo);
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

  const handleConfirmStatusChange = () => {
    if (!selectedUsuario) return;
    setConfirmStatusOpen(true);
  };

  const handleCancelStatusUpdate = () => {
    setConfirmStatusOpen(false);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedUsuario) return;

    setLoadingStatus(true);
    setConfirmStatusOpen(false);

    try {
      const nuevoStatus = selectedUsuario.status === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      const response = await actualizarStatusUsuario(selectedUsuario.id, nuevoStatus);

      // 🔹 Actualizamos localmente
      setSelectedUsuario({ ...selectedUsuario, status: nuevoStatus });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === selectedUsuario.id ? { ...u, status: nuevoStatus } : u))
      );

      showTimedMessage("success", response);
    } catch (err) {
      showTimedMessage("error", err.message || "Error al cambiar el status");
    } finally {
      setLoadingStatus(false);
    }
  };

  // Abrir confirmación de cambio de correo
  const handleConfirmEmailUpdate = () => {
    if (!selectedUsuario) return;
    if (!correo || correo.trim() === "") {
      showTimedMessage("error", "El correo no puede estar vacío");
      return;
    }
    // 🔹 Validación correo igual al actual
    if (correo.trim() === selectedUsuario.correo) {
      showTimedMessage("error", "El correo ingresado es igual al actual");
      return;
    }
    setConfirmEmailOpen(true);
  };

  // Cancelar confirmación
  const handleCancelEmailUpdate = () => {
    setConfirmEmailOpen(false);
  };

  // Confirmar cambio de correo
  const confirmEmailUpdate = async () => {
    if (!selectedUsuario) return;
    setLoadingEmail(true);
    setConfirmEmailOpen(false);
    setModalMessage("");
    try {
      const response = await actualizarCorreoUsuario(selectedUsuario.id, correo);
      // 🔹 Actualizamos localmente el usuario
      setSelectedUsuario({ ...selectedUsuario, correo });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === selectedUsuario.id ? { ...u, correo } : u))
      );
      showTimedMessage("success", response);
    } catch (err) {
      showTimedMessage("error", err.message || "Error al actualizar el correo");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleConfirmPasswordUpdate = () => {
    if (!nuevaContrasena.trim()) {
      showTimedMessage("error", "La contraseña no puede estar vacía");
      return;
    }
    setConfirmPasswordOpen(true);
  };

  const handleCancelPasswordUpdate = () => {
    setConfirmPasswordOpen(false);
  };

  // Confirmar cambio de contraseña
  const confirmPasswordUpdate = async (passwordValue) => {
    if (!selectedUsuario) return;

    const password = passwordValue?.trim();
    if (!password) {
      showTimedMessage("error", "La contraseña no puede estar vacía");
      return;
    }

    setGenerandoContrasena(true);
    setConfirmPasswordOpen(false);
    setModalMessage("");

    try {
      const response = await actualizarContrasenaUsuario(selectedUsuario.id, password);
      showTimedMessage("success", response);
      setNuevaContrasena("");
    } catch (err) {
      showTimedMessage("error", err.message || "Error al actualizar la contraseña");
    } finally {
      setGenerandoContrasena(false);
    }
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
      // 🔹 Ya se eliminó localmente en el provider
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioToDelete.id));
      // Mensaje de éxito
      showTimedMessage("success", msg);
    } catch (err) {
      showTimedMessage("error", err.message || "Error al eliminar usuario");
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

      {/* 🔹 Modal principal */}
      {modalOpen && selectedUsuario && (
        <div className="modal">
          <div className="modal-content edit">
            <h3 className="modal-title">Administrar Usuario</h3>

            <div className="modal-form">
              <div className="modal-form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  value={`${selectedUsuario.nombre} ${selectedUsuario.apellidoPaterno} ${selectedUsuario.apellidoMaterno}`}
                  disabled
                />
              </div>

              {/* Correo editable */}
              <div className="modal-form-group horizontal">
                <label>Correo</label>
                <div className="email-actions">
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="Correo del usuario"
                    required
                  />
                  <button
                    type="button"
                    className="btn-email"
                    onClick={handleConfirmEmailUpdate}
                    disabled={loadingEmail}
                  >
                    {loadingEmail ? "Procesando..." : "Actualizar"}
                  </button>
                </div>
              </div>

              {/* Contraseña editable */}
              <div className="modal-form-group horizontal">
                <label>Contraseña</label>
                <div className="password-actions">
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      placeholder="Actualizar contraseña"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword((prev) => !prev)}
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <button
                      type="button"
                      className="btn-password"
                      onClick={handleConfirmPasswordUpdate}
                    >
                      Actualizar
                    </button>
                </div>
              </div>

              {/* Botón cambiar status */}
              <div className="modal-form-group">
                <label>Status</label>
                <button
                  type="button"
                  className="btn-status"
                  onClick={() => handleConfirmStatusChange()}
                  disabled={loadingStatus}
                >
                  {loadingStatus ? "Procesando..." : `Cambiar status a ${selectedUsuario.status === "ACTIVO" ? "INACTIVO" : "ACTIVO"}`}
                </button>
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
                    "Eliminar Usuario"
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
          <div className="modal-content eliminar">
            <h3>¿Eliminar Usuario?</h3>
            <p>
              ¿Seguro que deseas eliminar al usuario{" "}
              <strong>{`${usuarioToDelete.nombre} ${usuarioToDelete.apellidoPaterno} ${usuarioToDelete.apellidoMaterno}`}</strong>?
            </p>
            <div className="confirmar-buttons">
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
      {/* Modal confirmación contraseña */}
      {confirmPasswordOpen && (
        <div className="modal">
          <div className="modal-content confirmar">
            <h3>Actualizar Contraseña</h3>
            <p>
              ¿Seguro que deseas actualizar la contraseña del usuario{" "}
              <strong>{`${selectedUsuario.nombre} ${selectedUsuario.apellidoPaterno} ${selectedUsuario.apellidoMaterno}`}</strong>?
            </p>
            <div className="confirmar-buttons">
              <button
                className="btn-cancelar"
                onClick={handleCancelPasswordUpdate}
                disabled={generandoContrasena}
              >
                Cancelar
              </button>
              <button
                className="btn-guardar"
                onClick={() => confirmPasswordUpdate(nuevaContrasena)}
                disabled={generandoContrasena}
              >
                {generandoContrasena ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal confirmación correo */}
      {confirmEmailOpen && (
        <div className="modal">
          <div className="modal-content confirmar">
            <h3>Actualizar Correo</h3>
            <p>
              ¿Seguro que deseas actualizar el correo del usuario{" "}
              <strong>{`${selectedUsuario.nombre} ${selectedUsuario.apellidoPaterno} ${selectedUsuario.apellidoMaterno}`}</strong> a:{" "}
              <strong>{correo}</strong>?
            </p>
            <div className="confirmar-buttons">
              <button
                className="btn-cancelar"
                onClick={handleCancelEmailUpdate}
                disabled={loadingEmail}
              >
                Cancelar
              </button>
              <button
                className="btn-guardar"
                onClick={confirmEmailUpdate}
                disabled={loadingEmail}
              >
                {loadingEmail ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal confirmación status */}
      {confirmStatusOpen && selectedUsuario && (
        <div className="modal">
          <div className="modal-content confirmar">
            <h3>Cambiar Status</h3>
            <p>
              ¿Seguro que deseas cambiar el status del usuario{" "}
              <strong>{`${selectedUsuario.nombre} ${selectedUsuario.apellidoPaterno} ${selectedUsuario.apellidoMaterno}`}</strong>{" "}
              a <strong>{selectedUsuario.status === "ACTIVO" ? "INACTIVO" : "ACTIVO"}</strong>?
            </p>
            <div className="confirmar-buttons">
              <button
                className="btn-cancelar"
                onClick={handleCancelStatusUpdate}
                disabled={loadingStatus}
              >
                Cancelar
              </button>
              <button
                className="btn-guardar"
                onClick={confirmStatusUpdate}
                disabled={loadingStatus}
              >
                {loadingStatus ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultaUsuarios;
