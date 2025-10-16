// src/tabs/Vocalias.jsx
import React from "react";
import { useVocalia } from "../hooks/useVocalia";
import { FaSpinner, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Vocalias.css";

const Vocalias = () => {
  const {
    vocalias,
    loading,
    error,
    crearVocalia,
    actualizarVocalia,
    eliminarVocalia,
  } = useVocalia();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedVocalia, setSelectedVocalia] = React.useState(null);
  const [newVocalia, setNewVocalia] = React.useState({
    abreviatura: "",
    nombreCompleto: "",
  });
  const [loadingCreate, setLoadingCreate] = React.useState(false);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);

  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState(""); // "success" o "error"
  const [modalMessage, setModalMessage] = React.useState("");
  const [modalMessageType, setModalMessageType] = React.useState("");
  // Mensajes específicos para la tabla
  const [tableMessage, setTableMessage] = React.useState("");
  const [tableMessageType, setTableMessageType] = React.useState(""); // "success" o "error"
  // Modal de confirmación para eliminar
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [vocaliaToDelete, setVocaliaToDelete] = React.useState(null);

  const showMessage = (msg, type, context = "form") => {
    if (context === "modal") {
      setModalMessage(msg);
      setModalMessageType(type);
      setTimeout(() => setModalMessage(""), type === "success" ? 5000 : 10000);
    } else if (context === "table") {
      setTableMessage(msg);
      setTableMessageType(type);
      setTimeout(() => setTableMessage(""), type === "success" ? 5000 : 10000);
    } else {
      // por defecto, formulario de creación
      setMessage(msg);
      setMessageType(type);
      setTimeout(() => setMessage(""), type === "success" ? 5000 : 10000);
    }
  };

  const handleEditClick = (vocalia) => {
    setSelectedVocalia(vocalia);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVocalia(null);
    setModalOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    showMessage("Procesando...", "info");

    try {
      const res = await crearVocalia(newVocalia);
      if (res.success) {
        setNewVocalia({ abreviatura: "", nombreCompleto: "" });
        showMessage(res.message, "success");
      } else {
        showMessage(res.message, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Error al crear vocalía", "error");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    showMessage("Procesando...", "info", "modal"); // ✅ usar "modal"

    try {
      const res = await actualizarVocalia(selectedVocalia.id, selectedVocalia);
      if (res.success) {
        showMessage(res.message, "success", "modal"); // ✅ usar "modal"
        setTimeout(() => handleCloseModal(), 6000);
      } else {
        showMessage(res.message, "error", "modal"); // ✅ usar "modal"
      }
    } catch (err) {
      console.error(err);
      showMessage("Error al actualizar vocalía", "error", "modal"); // ✅ usar "modal"
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Abre el modal de confirmación
  const handleDeleteClick = (vocalia) => {
    setVocaliaToDelete(vocalia);
    setConfirmOpen(true);
  };

  // Confirma la eliminación
  const confirmDelete = async () => {
    if (!vocaliaToDelete) return;

    setLoadingDelete(true);
    showMessage("Procesando...", "info", "table");

    try {
      const res = await eliminarVocalia(vocaliaToDelete.id);
      if (res.success) {
        showMessage(res.message, "success", "table");
        if (modalOpen) handleCloseModal();
      } else {
        showMessage(res.message, "error", "table");
      }
    } catch (err) {
      console.error(err);
      showMessage("Error al eliminar vocalía", "error", "table");
    } finally {
      setLoadingDelete(false);
      setConfirmOpen(false);
      setVocaliaToDelete(null);
    }
  };

  if (loading) return <p>Cargando vocalías...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="vocalias-container">
      <h2 className="vocalias-title">Lista de Vocalías Activas</h2>
      <div className="vocalias-form-table">
        {tableMessage && (
          <div className={`form-message-table ${tableMessageType}`}>
            {tableMessage}
          </div>
        )}
        <table className="tab-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Abreviatura</th>
              <th>Nombre Completo</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {vocalias.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.abreviatura}</td>
                <td>{v.nombreCompleto}</td>
                <td className="action-cell">
                  <button
                    className="btn-icon edit"
                    onClick={() => handleEditClick(v)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td className="action-cell">
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDeleteClick(v)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="vocalias-title">Registrar Nueva Vocalía</h2>
      <form className="vocalias-form" onSubmit={handleCreate}>
        <div className="vocalias-form-group">
          <label>Abreviatura</label>
          <input
            type="text"
            name="abreviatura"
            value={newVocalia.abreviatura}
            onChange={(e) =>
              setNewVocalia((prev) => ({
                ...prev,
                abreviatura: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className="vocalias-form-group">
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombreCompleto"
            value={newVocalia.nombreCompleto}
            onChange={(e) =>
              setNewVocalia((prev) => ({
                ...prev,
                nombreCompleto: e.target.value,
              }))
            }
            required
          />
        </div>
        {message && <div className={`form-message-create ${messageType}`}>{message}</div>}
        <button
          type="submit"
          disabled={loadingCreate}
          className="vocalias-btn-guardar"
        >
          {loadingCreate ? (
            <>
              Procesando... <FaSpinner className="spinner" />
            </>
          ) : (
            "Crear Vocalía"
          )}
        </button>
      </form>

      {modalOpen && selectedVocalia && (
        <div className="modal">
          <div className="modal-content edit">
            <h3 className="modal-title">Editar Vocalía</h3>

            <form onSubmit={handleUpdate} className="modal-form">
              <div className="modal-form-group">
                <label>Abreviatura</label>
                <input
                  type="text"
                  value={selectedVocalia.abreviatura}
                  onChange={(e) =>
                    setSelectedVocalia((prev) => ({
                      ...prev,
                      abreviatura: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  value={selectedVocalia.nombreCompleto}
                  onChange={(e) =>
                    setSelectedVocalia((prev) => ({
                      ...prev,
                      nombreCompleto: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {modalMessage && (
                <div className={`form-message-modal ${modalMessageType}`}>
                  {modalMessage}
                </div>
              )}

              <div className="modal-buttons">
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="btn-guardar"
                >
                  {loadingUpdate ? (
                    <>
                      <FaSpinner className="spinner" /> Procesando...
                    </>
                  ) : (
                    "Actualizar"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-cancelar"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmOpen && vocaliaToDelete && (
        <div className="modal">
          <div className="modal-content confirm">
            <h3>¿Eliminar Vocalía?</h3>
            <p>
              ¿Seguro que deseas eliminar la vocalía{" "}
              <strong>{vocaliaToDelete.nombreCompleto}</strong>?
            </p>
            <div className="confirm-buttons">
              <button
                className="btn-cancelar"
                onClick={() => setConfirmOpen(false)}
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

export default Vocalias;
