//src/tabs/Zores.jsx
import React, { useEffect, useState } from "react";
import "../styles/Zores.css";
import { FaSpinner, FaEdit } from "react-icons/fa";
import { useZore } from "../hooks/useZore";
import Pagination from "../components/Pagination"; // ✅ Importa tu componente

const Zores = () => {
  const {
    zores,
    usuariosSE,
    loading,
    pageInfo,
    currentPage,
    setCurrentPage,
    cargarZores,
    cargarUsuariosSE,
    crearZore,
    actualizarZore,
  } = useZore();

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
    cargarUsuariosSE();
    cargarZores(currentPage, pageSize);
  }, [currentPage, cargarZores, cargarUsuariosSE]);

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

  // 🔹 Mostrar mensajes del modal con control total del tiempo
  const showModalMessage = (msg, type) => {
    return new Promise((resolve) => {
      setMessageModal(msg);
      setMessageModalType(type);
      const duration = type === "success" ? 5000 : 10000;

      setTimeout(() => {
        setMessageModal("");
        resolve(type); // Resuelve cuando termina el mensaje
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
    const result = await crearZore(dto);
    showMessage(result.message, result.success ? "success" : "error", "form");
    if (result.success) {
      setFormData({ numeracion: "", anio: "", usuarioId: "" });
    }
  };

  const handleEdit = (zore) => {
    setEditData(zore);
    setEditFormData({
      numeracion: zore.numeracion,
      anio: zore.anio,
      usuarioId: zore.usuario ? zore.usuario.id : "",
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

    const result = await actualizarZore(editData.id, dto);
    setLoadingModal(false);

    if (result.success) {
      // 🔹 Espera a que termine el mensaje (5 s) y luego cierra modal 1 s después
      await showModalMessage(result.message, "success");
      setTimeout(() => {
        setShowModal(false);
        setEditData(null);
        setEditFormData({ numeracion: "", anio: "", usuarioId: "" });
      }, 1000);
    } else {
      // 🔹 Muestra mensaje de error durante 10 s sin cerrar modal
      showModalMessage(result.message, "error");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pageInfo.totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  if (loading) return <p>Cargando zores...</p>;

  return (
    <div className="zores-container">
      <h2 className="zores-title">Asignación de Zores</h2>

      {/* Mensaje tabla */}
      {messageTable && (
        <div className={`zores-message-table ${messageTableType}`}>
          {messageTable}
        </div>
      )}

      {/* Tabla de Zores */}
      <div className="zores-form-table">
        <table className="zores-table">
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
            {zores.map((z) => (
              <tr key={z.id}>
                <td>{z.id}</td>
                <td>{z.numeracion}</td>
                <td>{z.anio}</td>
                <td>
                  {z.usuario
                    ? z.usuario.nombreCompleto ||
                      `${z.usuario.nombre} ${z.usuario.apellidoPaterno} ${z.usuario.apellidoMaterno}`
                    : "—"}
                </td>
                <td className="zores-action-cell">
                  <button className="zores-btn-icon edit" onClick={() => handleEdit(z)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Paginación visual */}
      <Pagination
        currentPage={currentPage}
        totalPages={pageInfo.totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />

      {/* Formulario crear Zore */}
      <h2 className="zores-title">Crear nueva Zore</h2>
      <form className="zores-form" onSubmit={handleCreate}>
        <div className="zores-form-group">
          <label>Numeración</label>
          <input
            type="text"
            name="numeracion"
            value={formData.numeracion}
            onChange={(e) => {
              const value = e.target.value;
              // Solo permitir hasta 3 dígitos, sin decimales ni negativos
              if (/^\d{0,3}$/.test(value)) {
                handleChange(e);
              }
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Número de Zore"
            maxLength={3}
            required
          />
        </div>

        <div className="zores-form-group">
          <label>Año</label>
          <input 
            type="text" 
            name="anio" 
            value={formData.anio} 
            onChange={(e) => {
              const value = e.target.value;
              // Permitir solo números
              if (/^\d*$/.test(value)) {
                handleChange(e); // solo actualiza si son dígitos
              }
            }} 
            placeholder="2025" 
            maxLength={4} 
            required 
          />
        </div>

        <div className="zores-form-group">
          <label>Usuario SE</label>
          <select name="usuarioId" value={formData.usuarioId} onChange={handleChange} required>
            <option value="">Seleccionar usuario...</option>
            {usuariosSE.map(u => (
              <option key={u.id} value={u.id}>{u.nombreCompleto}</option>
            ))}
          </select>
        </div>

        {messageForm && (
          <div className={`zores-message-form ${messageFormType}`}>{messageForm}</div>
        )}

        <button type="submit" className="zores-btn-guardar">
          Crear Zore
        </button>
      </form>

      {/* Modal de edición */}
      {showModal && editData && (
        <div className="zores-modal">
          <div className="zore-modal-content edit">
            <h3 className="zore-modal-title">Editar Zore</h3>
            <form className="zore-modal-form-grid">
              <div className="zore-modal-form-group">
                <label>Numeración</label>
                <input
                  type="text"
                  name="numeracion"
                  value={editFormData.numeracion}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Solo permitir hasta 3 dígitos, sin decimales ni negativos
                    if (/^\d{0,3}$/.test(value)) {
                      setEditFormData({ ...editFormData, [e.target.name]: value });
                    }
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Número de Zore"
                  maxLength={3}
                  required
                />
              </div>
              <div className="zore-modal-form-group">
                <label>Año</label>
                <input
                  type="text"
                  name="anio"
                  value={editFormData.anio}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir solo números
                    if (/^\d*$/.test(value)) {
                      setEditFormData({ ...editFormData, [e.target.name]: value });
                    }
                  }}
                  placeholder="2025"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
              </div>
              <div className="zore-modal-form-group">
                <label>Usuario SE</label>
                <select name="usuarioId" value={editFormData.usuarioId} onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })} required>
                  {usuariosSE.map(u => (
                    <option key={u.id} value={u.id}>{u.nombreCompleto}</option>
                  ))}
                </select>
              </div>

              {/* Mensajes del modal */}
              {messageModal && (
                <div className={`zore-modal-message ${messageModalType} ${!messageModal ? "hidden" : ""}`}>
                  {messageModal}
                </div>
              )}

              <div className="zore-modal-buttons">
                <button type="button" className="zore-btn-guardar" onClick={handleUpdate} disabled={loadingModal}>
                  {loadingModal ? <>Procesando... <FaSpinner className="zore-spinner" /></> : "Guardar"}
                </button>
                <button type="button" className="zore-btn-cancelar" onClick={() => setShowModal(false)}>
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

export default Zores;
