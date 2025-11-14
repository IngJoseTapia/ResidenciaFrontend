//src/tabs/Ares.jsx
import React, { useEffect, useState } from "react";
import "../styles/Ares.css";
import { FaSpinner, FaEdit } from "react-icons/fa";
import { useAre } from "../hooks/useAre";
import Pagination from "../components/Pagination";

const Ares = () => {
  const { ares, usuariosCAE, loading, pageInfo, currentPage, setCurrentPage, cargarAres, cargarUsuariosCAE, crearAre, actualizarAre } = useAre();

  const [formData, setFormData] = useState({
    numeracion: "",
    anio: "",
    usuarioId: "",
  });

  const [editFormData, setEditFormData] = useState({
    numeracion: "",
    anio: "",
    usuarioId: "",
  });

  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [messageForm, setMessageForm] = useState("");
  const [messageFormType, setMessageFormType] = useState("");
  const [messageTable, setMessageTable] = useState("");
  const [messageTableType, setMessageTableType] = useState("");
  const [messageModal, setMessageModal] = useState("");
  const [messageModalType, setMessageModalType] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);

  const pageSize = 10;

  // 🔹 Cargar listas
  useEffect(() => {
    cargarUsuariosCAE();
    cargarAres(currentPage, pageSize);
  }, [currentPage, cargarAres, cargarUsuariosCAE]);

  const showMessage = (msg, type, context = "form") => {
    if (context === "form") {
      setMessageForm(msg);
      setMessageFormType(type);
      setTimeout(() => setMessageForm(""), type === "success" ? 5000 : 10000);
    } else {
      setMessageTable(msg);
      setMessageTableType(type);
      setTimeout(() => setMessageTable(""), type === "success" ? 5000 : 10000);
    }
  };

  const showModalMessage = (msg, type) => {
    return new Promise((resolve) => {
      setMessageModal(msg);
      setMessageModalType(type);
      const duration = type === "success" ? 5000 : 10000;

      setTimeout(() => {
        setMessageModal("");
        resolve(type);
      }, duration);
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.usuarioId || !formData.numeracion || !formData.anio) {
      showMessage("Todos los campos son obligatorios.", "error", "form");
      return;
    }
    const dto = {
      numeracion: Number(formData.numeracion),
      anio: formData.anio,
      usuarioId: Number(formData.usuarioId),
    };
    const result = await crearAre(dto);
    showMessage(result.message, result.success ? "success" : "error", "form");
    if (result.success) {
      setFormData({ numeracion: "", anio: "", usuarioId: "" });
    }
  };

  const handleEdit = (are) => {
    setEditData(are);
    setEditFormData({
      numeracion: are.numeracion,
      anio: are.anio,
      usuarioId: are.usuario ? are.usuario.id : "",
    });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setLoadingModal(true);
    showModalMessage("Procesando...", "info");

    const dto = {
      numeracion: Number(editFormData.numeracion),
      anio: editFormData.anio,
      usuarioId: Number(editFormData.usuarioId),
    };

    const result = await actualizarAre(editData.id, dto);
    setLoadingModal(false);

    if (result.success) {
      await showModalMessage(result.message, "success");
      setTimeout(() => {
        setShowModal(false);
        setEditData(null);
        setEditFormData({ numeracion: "", anio: "", usuarioId: "" });
      }, 1000);
    } else {
      showModalMessage(result.message, "error");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pageInfo.totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  if (loading) return <p>Cargando ares...</p>;

  return (
    <div className="ares-container">
      <h2 className="ares-title">Asignación de Ares</h2>

      {messageTable && (
        <div className={`ares-message-table ${messageTableType}`}>
          {messageTable}
        </div>
      )}

      <div className="ares-form-table">
        <table className="ares-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Numeración</th>
              <th>Año</th>
              <th>Usuario</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {ares.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.numeracion}</td>
                <td>{a.anio}</td>
                <td>
                  {a.usuario
                    ? a.usuario.nombreCompleto ||
                      `${a.usuario.nombre} ${a.usuario.apellidoPaterno} ${a.usuario.apellidoMaterno}`
                    : "—"}
                </td>
                <td className="ares-action-cell">
                  <button className="ares-btn-icon edit" onClick={() => handleEdit(a)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pageInfo.totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />

      <h2 className="ares-title">Crear nueva Are</h2>
      <form className="ares-form" onSubmit={handleCreate}>
        <div className="ares-form-group">
          <label>Numeración</label>
          <input
            type="text"
            name="numeracion"
            value={formData.numeracion}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,3}$/.test(value)) handleChange(e);
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Número de Are"
            maxLength={3}
            required
          />
        </div>

        <div className="ares-form-group">
          <label>Año</label>
          <input
            type="text"
            name="anio"
            value={formData.anio}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) handleChange(e);
            }}
            placeholder="2025"
            maxLength={4}
            required
          />
        </div>

        <div className="ares-form-group">
          <label>Usuario CAE</label>
          <select
            name="usuarioId"
            value={formData.usuarioId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar usuario...</option>
            {usuariosCAE.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombreCompleto}
              </option>
            ))}
          </select>
        </div>

        {messageForm && (
          <div className={`ares-message-form ${messageFormType}`}>{messageForm}</div>
        )}

        <button type="submit" className="ares-btn-guardar">
          Crear Are
        </button>
      </form>

      {showModal && editData && (
        <div className="ares-modal">
          <div className="are-modal-content edit">
            <h3 className="are-modal-title">Editar Are</h3>
            <form className="are-modal-form-grid">
              <div className="are-modal-form-group">
                <label>Numeración</label>
                <input
                    type="text"
                    name="numeracion"
                    value={editFormData.numeracion}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Solo permitir hasta 3 dígitos, sin decimales ni negativos
                        if (/^\d{0,3}$/.test(value)) {
                        setEditFormData({
                            ...editFormData,
                            [e.target.name]: value,
                        });
                        }
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Número de Are"
                    maxLength={3}
                    required
                />
              </div>
              <div className="are-modal-form-group">
                <label>Año</label>
                <input
                    type="text"
                    name="anio"
                    value={editFormData.anio}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Solo permitir números (0–9)
                        if (/^\d*$/.test(value)) {
                        setEditFormData({
                            ...editFormData,
                            [e.target.name]: value,
                        });
                        }
                    }}
                    placeholder="2025"
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                />
              </div>
              <div className="are-modal-form-group">
                <label>Usuario SE</label>
                <select
                  name="usuarioId"
                  value={editFormData.usuarioId}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  required
                >
                  {usuariosCAE.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombreCompleto}
                    </option>
                  ))}
                </select>
              </div>

              {messageModal && (
                <div
                  className={`are-modal-message ${messageModalType} ${
                    !messageModal ? "hidden" : ""
                  }`}
                >
                  {messageModal}
                </div>
              )}

              <div className="are-modal-buttons">
                <button
                  type="button"
                  className="are-btn-guardar"
                  onClick={handleUpdate}
                  disabled={loadingModal}
                >
                  {loadingModal ? (
                    <>
                      Procesando... <FaSpinner className="are-spinner" />
                    </>
                  ) : (
                    "Guardar"
                  )}
                </button>
                <button
                  type="button"
                  className="are-btn-cancelar"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ares;
