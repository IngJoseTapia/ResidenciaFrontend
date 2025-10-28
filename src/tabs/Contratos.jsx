// src/tabs/Contratos.jsx
import React from "react";
import { useContrato } from "../hooks/useContrato";
import { FaSpinner, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Contratos.css";

const Contratos = () => {
  const {
    contratos,
    loading,
    error,
    crearContrato,
    actualizarContrato,
    eliminarContrato,
  } = useContrato();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedContrato, setSelectedContrato] = React.useState(null);

  const [newContrato, setNewContrato] = React.useState({
    puesto: "",
    codigo: "",
    nivelTabular: "",
    fechaInicio: "",
    fechaConclusion: "",
    actividadesGenericas: "",
    sueldo: "",
  });

  const [loadingCreate, setLoadingCreate] = React.useState(false);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);

  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("");
  const [modalMessage, setModalMessage] = React.useState("");
  const [modalMessageType, setModalMessageType] = React.useState("");
  const [tableMessage, setTableMessage] = React.useState("");
  const [tableMessageType, setTableMessageType] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [contratoToDelete, setContratoToDelete] = React.useState(null);

  const showMessage = (msg, type, context = "form") => {
    const setMsg = {
      modal: [setModalMessage, setModalMessageType],
      table: [setTableMessage, setTableMessageType],
      form: [setMessage, setMessageType],
    }[context];
    const [setText, setType] = setMsg;
    setText(msg);
    setType(type);
    setTimeout(() => setText(""), type === "success" ? 5000 : 10000);
  };

  const handleEditClick = (contrato) => {
    setSelectedContrato(contrato);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedContrato(null);
    setModalOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    showMessage("Procesando...", "info");

    try {
      const res = await crearContrato(newContrato);
      if (res.success) {
        setNewContrato({
          puesto: "",
          codigo: "",
          nivelTabular: "",
          fechaInicio: "",
          fechaConclusion: "",
          actividadesGenericas: "",
          sueldo: "",
        });
        showMessage(res.message, "success");
      } else {
        showMessage(res.message, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Error al crear contrato", "error");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    showMessage("Procesando...", "info", "modal");

    try {
      const res = await actualizarContrato(selectedContrato.id, selectedContrato);
      if (res.success) {
        showMessage(res.message, "success", "modal");
        setTimeout(() => handleCloseModal(), 6000);
      } else {
        showMessage(res.message, "error", "modal");
      }
    } catch (err) {
      console.error(err);
      showMessage("Error al actualizar contrato", "error", "modal");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteClick = (contrato) => {
    setContratoToDelete(contrato);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!contratoToDelete) return;
    setLoadingDelete(true);
    showMessage("Procesando...", "info", "table");

    try {
      const res = await eliminarContrato(contratoToDelete.id);
      if (res.success) {
        showMessage(res.message, "success", "table");
        if (modalOpen) handleCloseModal();
      } else {
        showMessage(res.message, "error", "table");
      }
    } catch (err) {
      console.error(err);
      showMessage("Error al eliminar contrato", "error", "table");
    } finally {
      setLoadingDelete(false);
      setConfirmOpen(false);
      setContratoToDelete(null);
    }
  };

  if (loading) return <p>Cargando contratos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="contratos-container">
      <h2 className="contratos-title">Lista de Contratos</h2>

      <div className="contratos-form-table">
        {tableMessage && (
          <div className={`contratos-message-table ${tableMessageType}`}>
            {tableMessage}
          </div>
        )}
        <table className="contratos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Puesto</th>
              <th>Código</th>
              <th>Nivel Tabular</th>
              <th>Fecha Inicio</th>
              <th>Fecha Conclusión</th>
              <th>Sueldo</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {contratos.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.puesto}</td>
                <td>{c.codigo}</td>
                <td>{c.nivelTabular}</td>
                <td>{c.fechaInicio}</td>
                <td>{c.fechaConclusion}</td>
                <td>${Number(c.sueldo).toFixed(2)}</td>
                <td className="action-cell">
                  <button
                    className="btn-icon edit"
                    onClick={() => handleEditClick(c)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td className="action-cell">
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDeleteClick(c)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="contratos-title">Registrar Nuevo Contrato</h2>
      <form className="contratos-form" onSubmit={handleCreate}>
        <div className="contratos-form-group">
          <label>Puesto</label>
          <input
            type="text"
            value={newContrato.puesto}
            onChange={(e) =>
              setNewContrato((prev) => ({ ...prev, puesto: e.target.value }))
            }
            required
          />
        </div>

        <div className="contratos-form-group">
          <label>Código</label>
          <input
            type="text"
            value={newContrato.codigo}
            onChange={(e) =>
              setNewContrato((prev) => ({ ...prev, codigo: e.target.value }))
            }
            required
          />
        </div>

        <div className="contratos-form-group">
          <label>Nivel Tabular</label>
          <input
            type="text"
            value={newContrato.nivelTabular}
            onChange={(e) =>
              setNewContrato((prev) => ({
                ...prev,
                nivelTabular: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="contratos-form-group">
          <label>Fecha de Inicio</label>
          <input
            type="date"
            value={newContrato.fechaInicio}
            onChange={(e) =>
              setNewContrato((prev) => ({
                ...prev,
                fechaInicio: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="contratos-form-group">
          <label>Fecha de Conclusión</label>
          <input
            type="date"
            value={newContrato.fechaConclusion}
            onChange={(e) =>
              setNewContrato((prev) => ({
                ...prev,
                fechaConclusion: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="contratos-form-group">
          <label>Actividades Genéricas</label>
          <input
            type="text"
            value={newContrato.actividadesGenericas}
            onChange={(e) =>
              setNewContrato((prev) => ({
                ...prev,
                actividadesGenericas: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="contratos-form-group">
          <label>Sueldo</label>
          <input
            type="number"
            step="0.01"
            value={newContrato.sueldo}
            onChange={(e) =>
              setNewContrato((prev) => ({
                ...prev,
                sueldo: e.target.value,
              }))
            }
            required
          />
        </div>

        {message && (
          <div className={`contratos-message-create ${messageType}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loadingCreate}
          className="contratos-btn-guardar"
        >
          {loadingCreate ? (
            <>
              Procesando... <FaSpinner className="spinner" />
            </>
          ) : (
            "Crear Contrato"
          )}
        </button>
      </form>

      {modalOpen && selectedContrato && (
        <div className="modal">
            <div className="modal-content edit">
            <h3 className="modal-title">Editar Contrato</h3>
            <form onSubmit={handleUpdate} className="modal-form-grid">
                <div className="modal-form-group">
                <label>Puesto</label>
                <input
                    type="text"
                    value={selectedContrato.puesto}
                    onChange={(e) =>
                    setSelectedContrato((prev) => ({
                        ...prev,
                        puesto: e.target.value,
                    }))
                    }
                    required
                />
                </div>

                <div className="modal-form-group">
                <label>Código</label>
                <input
                    type="text"
                    value={selectedContrato.codigo}
                    onChange={(e) =>
                    setSelectedContrato((prev) => ({
                        ...prev,
                        codigo: e.target.value,
                    }))
                    }
                    required
                />
                </div>

                <div className="modal-form-group">
                <label>Nivel Tabular</label>
                <input
                    type="text"
                    value={selectedContrato.nivelTabular}
                    onChange={(e) =>
                    setSelectedContrato((prev) => ({
                        ...prev,
                        nivelTabular: e.target.value,
                    }))
                    }
                    required
                />
                </div>

                <div className="modal-form-group">
                <label>Fecha de Inicio</label>
                <input
                    type="date"
                    value={selectedContrato.fechaInicio}
                    onChange={(e) =>
                    setSelectedContrato((prev) => ({
                        ...prev,
                        fechaInicio: e.target.value,
                    }))
                    }
                    required
                />
                </div>

                <div className="modal-form-group">
                <label>Fecha de Conclusión</label>
                <input
                    type="date"
                    value={selectedContrato.fechaConclusion}
                    onChange={(e) =>
                    setSelectedContrato((prev) => ({
                        ...prev,
                        fechaConclusion: e.target.value,
                    }))
                    }
                    required
                />
                </div>

                <div className="modal-form-group">
                <label>Actividades Genéricas</label>
                <input
                    type="text"
                    value={selectedContrato.actividadesGenericas}
                    onChange={(e) =>
                    setSelectedContrato((prev) => ({
                        ...prev,
                        actividadesGenericas: e.target.value,
                    }))
                    }
                    required
                />
                </div>

                <div className="modal-form-group">
                <label>Sueldo</label>
                <input
                    type="number"
                    step="0.01"
                    value={selectedContrato.sueldo}
                    onChange={(e) =>
                    setSelectedContrato((prev) => ({
                        ...prev,
                        sueldo: e.target.value,
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

      {confirmOpen && contratoToDelete && (
        <div className="modal">
          <div className="modal-content confirm">
            <h3>¿Eliminar Contrato?</h3>
            <p>
              ¿Seguro que deseas eliminar el contrato de{" "}
              <strong>{contratoToDelete.puesto}</strong>?
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

export default Contratos;
