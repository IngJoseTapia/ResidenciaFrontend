//src/tabs/Municipios.jsx
import React from "react";
import { useMunicipio } from "../hooks/useMunicipio";
import { FaSpinner, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Municipios.css";

const Municipios = () => {
  const {
    municipios,
    loading,
    error,
    crearMunicipio,
    actualizarMunicipio,
    eliminarMunicipio,
  } = useMunicipio();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedMunicipio, setSelectedMunicipio] = React.useState(null);
  const [newMunicipio, setNewMunicipio] = React.useState({
    id: "",
    nombre: "",
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
  const [municipioToDelete, setMunicipioToDelete] = React.useState(null);

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
      setMessage(msg);
      setMessageType(type);
      setTimeout(() => setMessage(""), type === "success" ? 5000 : 10000);
    }
  };

  const handleEditClick = (municipio) => {
    // Guardamos también el ID original para referencia
    setSelectedMunicipio({ ...municipio, idOriginal: municipio.id });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMunicipio(null);
    setModalOpen(false);
  };

  // ✅ Validaciones de entrada (idénticas al backend)
  const validarMunicipio = ({ id, nombre }) => {
    if (!nombre || nombre.trim() === "")
      return "El nombre del municipio no puede estar vacío";

    if (!id || id.trim() === "")
      return "El ID del municipio no puede estar vacío";

    const trimmed = id.trim();
    if (!/^\d+$/.test(trimmed))
      return "El ID del municipio solo puede contener números";

    if (trimmed.length > 3)
      return "El ID del municipio no puede tener más de 3 dígitos";

    return null;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    showMessage("Procesando...", "info");

    const errorMsg = validarMunicipio(newMunicipio);
    if (errorMsg) {
      showMessage(errorMsg, "error");
      setLoadingCreate(false);
      return;
    }

    try {
      const res = await crearMunicipio(newMunicipio);
      if (res.success) {
        setNewMunicipio({ id: "", nombre: "" });
        showMessage(res.message, "success");
      } else {
        showMessage(res.message, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Error al crear municipio", "error");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    showMessage("Procesando...", "info", "modal");

    const errorMsg = validarMunicipio(selectedMunicipio);
    if (errorMsg) {
      showMessage(errorMsg, "error", "modal");
      setLoadingUpdate(false);
      return;
    }

    try {
      // 🔍 Aquí usamos el idOriginal en la URL, y el body completo como dto
      const res = await actualizarMunicipio(
        selectedMunicipio.idOriginal,
        {
          id: selectedMunicipio.id,
          nombre: selectedMunicipio.nombre,
        }
      );

      if (res.success) {
        showMessage(res.message, "success", "modal");
        setTimeout(() => handleCloseModal(), 6000);
      } else {
        showMessage(res.message, "error", "modal");
      }
    } catch (err) {
      console.error(err);
      showMessage("Error al actualizar municipio", "error", "modal");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteClick = (municipio) => {
    setMunicipioToDelete(municipio);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!municipioToDelete) return;
    setLoadingDelete(true);
    showMessage("Procesando...", "info", "table");

    try {
      const res = await eliminarMunicipio(municipioToDelete.id);
      if (res.success) {
        showMessage(res.message, "success", "table");
      } else {
        showMessage(res.message, "error", "table");
      }
    } catch (err) {
      console.error(err);
      showMessage("Error al eliminar municipio", "error", "table");
    } finally {
      setLoadingDelete(false);
      setConfirmOpen(false);
      setMunicipioToDelete(null);
    }
  };

  if (loading) return <p>Cargando municipios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="municipios-container">
      <h2 className="municipios-title">Lista de Municipios Registrados</h2>

      <div className="municipios-form-table">
        {tableMessage && (
          <div className={`form-message-table-m ${tableMessageType}`}>
            {tableMessage}
          </div>
        )}
        <table className="municipios-table">
          <thead>
            <tr>
              <th>Clave</th>
              <th>Nombre</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {municipios.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre}</td>
                <td className="municipios-action-cell">
                  <button
                    className="municipios-btn-icon edit"
                    onClick={() => handleEditClick(m)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td className="municipios-action-cell">
                  <button
                    className="municipios-btn-icon delete"
                    onClick={() => handleDeleteClick(m)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="municipios-title">Registrar Nuevo Municipio</h2>
      <form className="municipios-form" onSubmit={handleCreate}>
        <div className="municipios-form-group">
          <label>ID (3 dígitos)</label>
          <input
            type="text"
            name="id"
            value={newMunicipio.id}
            onChange={(e) => {
              const value = e.target.value;
              // Solo permite números
              if (/^\d*$/.test(value)) {
                setNewMunicipio((prev) => ({ ...prev, id: value }));
              }
            }}
            maxLength={3}
            inputMode="numeric"
            pattern="\d*"
            required
          />
        </div>

        <div className="municipios-form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={newMunicipio.nombre}
            onChange={(e) =>
              setNewMunicipio((prev) => ({ ...prev, nombre: e.target.value }))
            }
            required
          />
        </div>

        {message && (
          <div className={`form-message-create-m ${messageType}`}>{message}</div>
        )}
        <button
          type="submit"
          disabled={loadingCreate}
          className="municipios-btn-guardar"
        >
          {loadingCreate ? (
            <>
              Procesando... <FaSpinner className="spinner" />
            </>
          ) : (
            "Crear Municipio"
          )}
        </button>
      </form>

      {modalOpen && selectedMunicipio && (
        <div className="modal">
          <div className="modal-content edit">
            <h3 className="modal-title">Editar Municipio</h3>

            <form onSubmit={handleUpdate} className="modal-form">
              <div className="modal-form-group">
                <label>ID (3 dígitos)</label>
                <input
                  type="text"
                  value={selectedMunicipio.id}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Solo permite números
                    if (/^\d*$/.test(value)) {
                      setSelectedMunicipio((prev) => ({ ...prev, id: value }));
                    }
                  }}
                  maxLength={3}
                  inputMode="numeric"
                  pattern="\d*"
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={selectedMunicipio.nombre}
                  onChange={(e) =>
                    setSelectedMunicipio((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {modalMessage && (
                <div className={`form-message-modal-m ${modalMessageType}`}>
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

      {confirmOpen && municipioToDelete && (
        <div className="modal">
          <div className="modal-content confirm">
            <h3>¿Eliminar Municipio?</h3>
            <p>
              ¿Seguro que deseas eliminar el municipio{" "}
              <strong>{municipioToDelete.nombre}</strong>?
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

export default Municipios;
