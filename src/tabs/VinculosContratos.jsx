// src/tabs/VinculosContratos.jsx
import React, { useEffect, useState } from "react";
import "../styles/VinculosContratos.css";
import { FaSpinner, FaEdit } from "react-icons/fa";
import { useUsuarioContrato } from "../hooks/useUsuarioContrato";

const VinculosContratos = () => {
  const { usuarioContratos, loading, cargarUsuarioContratos, asignarContrato, actualizarUsuarioContrato } = useUsuarioContrato();
  const { usuariosActivos, contratosActivos, cargarUsuariosActivos, cargarContratosActivos } = useUsuarioContrato();

  const [formData, setFormData] = useState({
    usuarioId: "",
    contratoId: "",
    numeroContrato: "",
    status: "",
    observaciones: "",
  });
  const [editFormData, setEditFormData] = useState({
    usuarioId: "",
    contratoId: "",
    numeroContrato: "",
    status: "",
    observaciones: "",
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

  // Cargar listas
  useEffect(() => {
    cargarUsuariosActivos();
    cargarContratosActivos();
  }, [cargarUsuariosActivos, cargarContratosActivos]);

  // Cargar vínculos
  useEffect(() => {
    cargarUsuarioContratos();
  }, [cargarUsuarioContratos]);

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

  // 🔹 Nueva función para mostrar mensajes dentro del modal
  const showModalMessage = (msg, type) => {
    setMessageModal(msg);
    setMessageModalType(type);
    setTimeout(() => setMessageModal(""), type === "success" ? 5000 : 10000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.usuarioId || !formData.contratoId || !formData.numeroContrato) {
      showMessage("Todos los campos son obligatorios.", "error", "form");
      return;
    }
    const result = await asignarContrato(formData);
    showMessage(result.message, result.success ? "success" : "error", "form");
    if (result.success) {
      setFormData({ usuarioId: "", contratoId: "", numeroContrato: "", status: "", observaciones: "" });
    }
  };

  const handleEdit = (vinculo) => {
    setEditData(vinculo);
    setEditFormData({
        usuarioId: vinculo.usuario ? vinculo.usuario.id : "",
        contratoId: vinculo.contrato.id,
        numeroContrato: vinculo.numeroContrato,
        status: vinculo.status,
        observaciones: vinculo.observaciones || "",
    });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setLoadingModal(true);
    showModalMessage("Procesando...", "info");

    const result = await actualizarUsuarioContrato(editData.id, editFormData);
    setLoadingModal(false);

    if (result.success) {
      showModalMessage(result.message, "success");
      setTimeout(() => {
        setShowModal(false);
        setEditData(null);
        setEditFormData({ usuarioId: "", contratoId: "", numeroContrato: "", status: "", observaciones: "" });
      }, 5000);
    } else {
      showModalMessage(result.message, "error");
    }
  };

  if (loading) return <p>Cargando vínculos...</p>;

  return (
    <div className="vinculos-container">
      <h2 className="vinculos-title">Asignación de contratos a usuarios</h2>

      {/* Mensaje tabla */}
      {messageTable && (
        <div className={`vinculos-message-table ${messageTableType}`}>
          {messageTable}
        </div>
      )}

      {/* Tabla de vínculos */}
      <div className="vinculos-form-table">
        <table className="vinculos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Contrato</th>
              <th>Número</th>
              <th>Status</th>
              <th>Observaciones</th>
              <th>Fecha de asignación</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {usuarioContratos.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>
                  {v.usuario
                    ? v.usuario.nombreCompleto ||
                      `${v.usuario.nombre} ${v.usuario.apellidoPaterno} ${v.usuario.apellidoMaterno}`
                    : v.usuarioEliminado
                    ? v.usuarioEliminado.nombreCompleto ||
                      `${v.usuarioEliminado.nombre} ${v.usuarioEliminado.apellidoPaterno} ${v.usuarioEliminado.apellidoMaterno}`
                    : "—"}
                </td>
                <td>{v.contrato.puesto}</td>
                <td>{v.numeroContrato}</td>
                <td>{v.status}</td>
                <td>{v.observaciones}</td>
                <td>{v.fechaAsignacion ? new Date(v.fechaAsignacion).toLocaleString("es-MX") : "—"}</td>
                <td className="action-cell">
                  <button className="btn-icon edit" onClick={() => handleEdit(v)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario crear vínculo */}
      <h2 className="vinculos-title">Crear nuevo vínculo</h2>
      <form className="vinculos-form" onSubmit={handleCreate}>
        <div className="vinculos-form-group">
          <label>Usuario</label>
          <select name="usuarioId" value={formData.usuarioId} onChange={handleChange} required>
            <option value="">Seleccionar usuario...</option>
            {usuariosActivos.map(u => (
              <option key={u.id} value={u.id}>{u.nombreCompleto}</option>
            ))}
          </select>
        </div>

        <div className="vinculos-form-group">
          <label>Contrato</label>
          <select name="contratoId" value={formData.contratoId} onChange={handleChange} required>
            <option value="">Seleccionar contrato...</option>
            {contratosActivos.map(c => (
              <option key={c.id} value={c.id}>{c.puesto}</option>
            ))}
          </select>
        </div>

        <div className="vinculos-form-group">
          <label>Número de contrato</label>
          <input type="text" name="numeroContrato" value={formData.numeroContrato} onChange={handleChange} placeholder="Número de contrato asignado al usuario" required/>
        </div>

        <div className="vinculos-form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="">Seleccionar status...</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="FINALIZADO">Finalizado</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="RESCINDIDO">Rescindido</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div className="vinculos-form-group">
          <label>Observaciones</label>
          <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} placeholder="Anotaciones u observaciones sobre la asignación de este contrato"></textarea>
        </div>

        {messageForm && (
          <div className={`vinculos-message-form ${messageFormType}`}>{messageForm}</div>
        )}

        <button type="submit" className="vinculos-btn-guardar">
          Crear vínculo
        </button>
      </form>

      {/* Modal de edición */}
      {showModal && editData && (
        <div className="modal">
          <div className="vinculo-modal-content edit">
            <h3 className="modal-title">Editar asignación</h3>
            <form className="modal-form-grid">
              <div className="modal-form-group">
                <label>Usuario</label>
                <select name="usuarioId" value={editFormData.usuarioId} onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })} required>
                    {usuariosActivos.map(u => (
                        <option key={u.id} value={u.id}>{u.nombreCompleto}</option>
                    ))}
                </select>
              </div>
              <div className="modal-form-group">
                <label>Contrato</label>
                <select name="contratoId" value={editFormData.contratoId} onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })} required>
                  {contratosActivos.map(c => (
                    <option key={c.id} value={c.id}>{c.puesto}</option>
                  ))}
                </select>
              </div>
              <div className="modal-form-group">
                <label>Número de contrato</label>
                <input type="text" name="numeroContrato" value={editFormData.numeroContrato} onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}/>
              </div>
              <div className="modal-form-group">
                <label>Status</label>
                <select name="status" value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })} required>
                  <option value="">Seleccionar status...</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="CANCELADO">Cancelado</option>
                  <option value="FINALIZADO">Finalizado</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="RESCINDIDO">Rescindido</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div className="modal-form-group">
                <label>Observaciones</label>
                <textarea name="observaciones" value={editFormData.observaciones} onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}></textarea>
              </div>

              {/* Mensajes del modal */}
              {messageModal && (
                <div className={`vinculos-message-form ${messageModalType}`}>
                  {messageModal}
                </div>
              )}

              <div className="modal-buttons">
                <button type="button" className="btn-guardar" onClick={handleUpdate} disabled={loadingModal}>
                  {loadingModal ? <>Procesando... <FaSpinner className="spinner" /></> : "Guardar"}
                </button>
                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>
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

export default VinculosContratos;
