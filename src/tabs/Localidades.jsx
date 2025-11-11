// src/tabs/Localidades.jsx
import React, { useEffect, useState } from "react";
import { useLocalidad } from "../hooks/useLocalidad";
import { useMunicipio } from "../hooks/useMunicipio";
import Pagination from "../components/Pagination";
import { FaSpinner, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Localidades.css";

const Localidades = () => {
  const {
    localidades,
    loading,
    error,
    crearLocalidad,
    actualizarLocalidad,
    eliminarLocalidad,
    page,
    setPage,
    totalPages,
  } = useLocalidad();

  // 🏘️ Importa los municipios reales desde el contexto
  const { municipios, cargarMunicipios, loading: loadingMunicipios } = useMunicipio();

  useEffect(() => {
    // Si no hay municipios cargados, los traemos
    if (municipios.length === 0) cargarMunicipios();
  }, [municipios, cargarMunicipios]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocalidad, setSelectedLocalidad] = useState(null);
  const [newLocalidad, setNewLocalidad] = useState({
    numero: "",
    nombre: "",
    municipioId: "",
  });

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");
  const [tableMessage, setTableMessage] = useState("");
  const [tableMessageType, setTableMessageType] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [localidadToDelete, setLocalidadToDelete] = useState(null);

  const showMessage = (msg, type, context = "form") => {
    const setters = {
      form: [setMessage, setMessageType],
      modal: [setModalMessage, setModalMessageType],
      table: [setTableMessage, setTableMessageType],
    };
    const [setMsg, setType] = setters[context];
    setMsg(msg);
    setType(type);
    setTimeout(() => setMsg(""), type === "success" ? 5000 : 10000);
  };

  const handleEditClick = (localidad) => {
    setSelectedLocalidad({
      idOriginal: localidad.id,
      numero: localidad.numeroLocalidad,
      nombre: localidad.nombre,
      municipioId: localidad.municipioId || "",
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLocalidad(null);
    setModalOpen(false);
  };

  // ✅ Validaciones
  const validarLocalidad = ({ numero, nombre, municipioId }) => {
    if (!numero || numero.trim() === "")
      return "El número de localidad no puede estar vacío";
    if (!/^\d+$/.test(numero.trim()))
      return "El número de localidad solo puede contener números";
    if (numero.trim().length > 10)
      return "El número de localidad no puede tener más de 10 dígitos";
    if (!nombre || nombre.trim() === "")
      return "El nombre de la localidad no puede estar vacío";
    if (!municipioId || municipioId.trim() === "")
      return "Debe seleccionar un municipio";
    return null;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    showMessage("Procesando...", "info");

    const errorMsg = validarLocalidad(newLocalidad);
    if (errorMsg) {
      showMessage(errorMsg, "error");
      setLoadingCreate(false);
      return;
    }

    try {
      const res = await crearLocalidad({
        numeroLocalidad: newLocalidad.numero,
        nombre: newLocalidad.nombre,
        municipioId: newLocalidad.municipioId,
      });
      if (res.success) {
        setNewLocalidad({ numero: "", nombre: "", municipioId: "" });
        showMessage(res.message, "success");
      } else showMessage(res.message, "error");
    } catch (err) {
      console.error(err);
      showMessage("Error al crear localidad", "error");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    showMessage("Procesando...", "info", "modal");

    const errorMsg = validarLocalidad(selectedLocalidad);
    if (errorMsg) {
      showMessage(errorMsg, "error", "modal");
      setLoadingUpdate(false);
      return;
    }

    try {
      const res = await actualizarLocalidad(selectedLocalidad.idOriginal, {
        numeroLocalidad: selectedLocalidad.numero,
        nombre: selectedLocalidad.nombre,
        municipioId: selectedLocalidad.municipioId,
      });
      if (res.success) {
        showMessage(res.message, "success", "modal");
        setTimeout(() => handleCloseModal(), 6000);
      } else showMessage(res.message, "error", "modal");
    } catch (err) {
      console.error(err);
      showMessage("Error al actualizar localidad", "error", "modal");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteClick = (localidad) => {
    setLocalidadToDelete(localidad);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!localidadToDelete) return;
    setLoadingDelete(true);
    showMessage("Procesando...", "info", "table");

    try {
      const res = await eliminarLocalidad(localidadToDelete.id);
      if (res.success) {
        showMessage(res.message, "success", "table");
      } else showMessage(res.message, "error", "table");
    } catch (err) {
      console.error(err);
      showMessage("Error al eliminar localidad", "error", "table");
    } finally {
      setLoadingDelete(false);
      setConfirmOpen(false);
      setLocalidadToDelete(null);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };

  if (loading) return <p>Cargando localidades...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="localidades-container">
      <h2 className="localidades-title">Lista de Localidades Registradas</h2>

      <div className="localidades-form-table">
        {tableMessage && (
          <div className={`form-message-table-l ${tableMessageType}`}>
            {tableMessage}
          </div>
        )}
        <table className="localidades-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Nombre</th>
              <th>Municipio</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {localidades.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.numeroLocalidad}</td>
                <td>{l.nombre}</td>
                <td>{l.municipioNombre || "Sin municipio"}</td>
                <td className="localidades-action-cell">
                  <button
                    className="localidades-btn-icon edit"
                    onClick={() => handleEditClick(l)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td className="localidades-action-cell">
                  <button
                    className="localidades-btn-icon delete"
                    onClick={() => handleDeleteClick(l)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Paginación controlada desde el provider */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      )}

      <h2 className="localidades-title">Registrar Nueva Localidad</h2>
      <form className="localidades-form" onSubmit={handleCreate}>
        <div className="localidades-form-group">
          <label>Número de Localidad</label>
          <input
            type="text"
            name="numero"
            value={newLocalidad.numero}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value))
                setNewLocalidad((prev) => ({ ...prev, numero: value }));
            }}
            maxLength={3}
            required
          />
        </div>

        <div className="localidades-form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={newLocalidad.nombre}
            onChange={(e) =>
              setNewLocalidad((prev) => ({ ...prev, nombre: e.target.value }))
            }
            required
          />
        </div>

        {/* 🏘️ Selector de municipio */}
        <div className="localidades-form-group">
          <label>Municipio</label>
          <select
            name="municipioId"
            value={newLocalidad.municipioId}
            onChange={(e) =>
              setNewLocalidad((prev) => ({
                ...prev,
                municipioId: e.target.value.padStart(3, "0") // "1" -> "001"
              }))
            }
            required
          >
            <option value="">
              {loadingMunicipios ? "Cargando municipios..." : "-- Selecciona un municipio --"}
            </option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <div className={`form-message-create-l ${messageType}`}>
            {message}
          </div>
        )}
        <button
          type="submit"
          disabled={loadingCreate}
          className="localidades-btn-guardar"
        >
          {loadingCreate ? (
            <>
              Procesando... <FaSpinner className="spinner" />
            </>
          ) : (
            "Crear Localidad"
          )}
        </button>
      </form>

      {/* MODAL DE EDICIÓN */}
      {modalOpen && selectedLocalidad && (
        <div className="modal">
          <div className="modal-content edit">
            <h3 className="modal-title">Editar Localidad</h3>
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="modal-form-group">
                <label>Número</label>
                <input
                  type="text"
                  value={selectedLocalidad.numero}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value))
                      setSelectedLocalidad((prev) => ({
                        ...prev,
                        numero: value,
                      }));
                  }}
                  maxLength={3}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={selectedLocalidad.nombre}
                  onChange={(e) =>
                    setSelectedLocalidad((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Municipio</label>
                <select
                  value={selectedLocalidad.municipioId}
                  onChange={(e) =>
                    setSelectedLocalidad((prev) => ({
                      ...prev,
                      municipioId: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">
                    {loadingMunicipios ? "Cargando municipios..." : "-- Selecciona un municipio --"}
                  </option>
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {modalMessage && (
                <div className={`form-message-modal-l ${modalMessageType}`}>
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

      {/* CONFIRMAR ELIMINACIÓN */}
      {confirmOpen && localidadToDelete && (
        <div className="modal">
          <div className="modal-content confirm">
            <h3>¿Eliminar Localidad?</h3>
            <p>
              ¿Seguro que deseas eliminar la localidad{" "}
              <strong>{localidadToDelete.nombre}</strong>?
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

export default Localidades;
