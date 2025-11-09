// src/tabs/AsignacionesZoreAre.jsx
import React, { useEffect, useState } from "react";
import "../styles/AsignacionesZoreAre.css";
import { FaSpinner, FaEdit } from "react-icons/fa";
import { useAsignacionZoreAre } from "../hooks/useAsignacionZoreAre";
import Pagination from "../components/Pagination";

const AsignacionesZoreAre = () => {
  const {
    asignaciones,
    anios,
    zores,
    ares,
    loading,
    pageInfo,
    currentPage,
    setCurrentPage,
    cargarAsignaciones,
    cargarAniosZore,
    cargarZoresPorAnio,
    cargarAresPorAnio,
    cargarAresPorAnioIncluyendo,
    crearAsignacion,
    actualizarAsignacion,
  } = useAsignacionZoreAre();

  const [formData, setFormData] = useState({
    anio: "",
    zoreId: "",
    areId: "",
  });
  const [editFormData, setEditFormData] = useState({
    anio: "",
    zoreId: "",
    areId: "",
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

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    cargarAsignaciones(currentPage, pageSize);
    cargarAniosZore();
  }, [currentPage, cargarAsignaciones, cargarAniosZore]);

  // 🔹 Cuando se seleccione un año, cargar Zores y limpiar los selects dependientes
  useEffect(() => {
    if (formData.anio) {
      cargarZoresPorAnio(formData.anio);
      setFormData((prev) => ({ ...prev, zoreId: "", areId: "" }));
    }
  }, [formData.anio, cargarZoresPorAnio]);

  // 🔹 Cuando se seleccione una Zore, cargar Ares disponibles
  useEffect(() => {
    if (formData.anio && formData.zoreId) {
      cargarAresPorAnio(formData.anio);
    }
  }, [formData.zoreId, formData.anio, cargarAresPorAnio]);

  // 🔹 Efecto para actualizar selects dependientes dentro del modal
  // 🔹 Modal: cuando cambia el año, limpiar selects dependientes y recargar zores
  useEffect(() => {
    if (!showModal) return;

    // Solo recargar zores si el usuario cambia manualmente el año
    // y no es la primera apertura del modal (editData recién cargado)
    if (editData && editFormData.anio === editData.anio) {
        return; // no resetear nada al abrir el modal
    }

    if (editFormData.anio) {
        setEditFormData((prev) => ({ ...prev, zoreId: "", areId: "" }));
        cargarZoresPorAnio(editFormData.anio);
    } else {
        cargarZoresPorAnio("");
        cargarAresPorAnio("");
    }
  }, [editFormData.anio, showModal, editData, cargarZoresPorAnio, cargarAresPorAnio]);


    // 🔹 Modal: cuando cambia la ZORE, limpiar ARE y recargar las del año actual
  useEffect(() => {
    if (!showModal) return;

    // Evita ejecutar al abrir el modal con los datos originales
    if (editData && editFormData.zoreId === String(editData.zore.id)) {
      return;
    }

    if (showModal && editFormData.anio && editFormData.zoreId) {
      setEditFormData((prev) => ({ ...prev, areId: "" }));
      cargarAresPorAnio(editFormData.anio);
    } else if (showModal && !editFormData.zoreId) {
      cargarAresPorAnio("");
    }
  }, [editFormData.zoreId, editFormData.anio, showModal, editData, cargarAresPorAnio]);

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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.anio || !formData.zoreId || !formData.areId) {
      showMessage("Todos los campos son obligatorios.", "error", "form");
      return;
    }

    const dto = {
      anio: formData.anio,
      zoreId: Number(formData.zoreId),
      areId: Number(formData.areId),
    };

    const result = await crearAsignacion(dto);
    showMessage(result.message, result.success ? "success" : "error", "form");

    if (result.success) {
      setFormData({ anio: "", zoreId: "", areId: "" });
      await cargarAsignaciones(currentPage, pageSize);
    }
  };

  const handleEdit = async (asignacion) => {
    // cargar dependencias primero
    await cargarZoresPorAnio(String(asignacion.anio));

    // cargar ares incluyendo el are actual para que aparezca en la lista aunque esté asignada
    await cargarAresPorAnioIncluyendo(String(asignacion.anio), asignacion.are?.id);

    // ahora cargar info local para el modal (usar strings para evitar mismatch)
    setEditData(asignacion);
    setEditFormData({
      anio: String(asignacion.anio ?? ""),
      zoreId: String(asignacion.zore?.id ?? ""),
      areId: String(asignacion.are?.id ?? ""),
    });

    setShowModal(true);
  };

  const handleUpdate = async () => {
    setLoadingModal(true);
    await showModalMessage("Procesando...", "info");

    // validación local
    if (!editFormData.anio || !editFormData.zoreId || !editFormData.areId) {
      setLoadingModal(false);
      return showModalMessage("Todos los campos son obligatorios.", "error");
    }

    const dto = {
      anio: editFormData.anio,
      zoreId: Number(editFormData.zoreId),
      areId: Number(editFormData.areId),
    };

    console.log("📤 Enviando DTO al backend:", dto, "ID asignacion:", editData?.id);

    const result = await actualizarAsignacion(editData.id, dto);
    setLoadingModal(false);

    if (result.success) {
      await showModalMessage(result.message, "success");
      await cargarAsignaciones(currentPage, pageSize);
      setTimeout(() => {
        setShowModal(false);
        setEditData(null);
        setEditFormData({ anio: "", zoreId: "", areId: "" });
      }, 1000);
    } else {
      showModalMessage(result.message, "error");
    }
  };

  const handlePrevPage = () => currentPage > 0 && setCurrentPage((prev) => prev - 1);
  const handleNextPage = () =>
    currentPage < pageInfo.totalPages - 1 && setCurrentPage((prev) => prev + 1);

  if (loading) return <p>Cargando asignaciones...</p>;

  return (
    <div className="asignacioneszoreare-container">
      <h2 className="asignacioneszoreare-title">Asignación de Zores y Ares</h2>

      {messageTable && (
        <div className={`asignacioneszoreare-message-table ${messageTableType}`}>
          {messageTable}
        </div>
      )}

      <div className="asignacioneszoreare-form-table">
        <table className="asignacioneszoreare-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Año</th>
              <th>Zore</th>
              <th>Responsable SE</th>
              <th>Are</th>
              <th>Responsable CAE</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.anio}</td>
                <td>{a.zore.numeracion}</td>
                <td>{a.zore.nombreUsuario || "—"}</td>
                <td>{a.are.numeracion}</td>
                <td>{a.are.nombreUsuario || "—"}</td>
                <td className="asignacioneszoreare-action-cell">
                  <button
                    className="asignacioneszoreare-btn-icon edit"
                    onClick={() => handleEdit(a)}
                  >
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

      <h2 className="asignacioneszoreare-title">Crear nueva Asignación</h2>
      <form className="asignacioneszoreare-form" onSubmit={handleCreate}>
        {/* Año */}
        <div className="asignacioneszoreare-form-group">
          <label>Año</label>
          <select
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar año...</option>
            {anios.map((a, index) => (
                <option key={a.id || index} value={a.anio}>
                    {a.anio}
                </option>
              ))}
          </select>
        </div>

        {/* Zore */}
        <div className="asignacioneszoreare-form-group">
          <label>Zore</label>
          <select
            name="zoreId"
            value={formData.zoreId}
            onChange={handleChange}
            disabled={!formData.anio}
            required
          >
            <option value="">Seleccionar Zore...</option>
            {zores.map((z) => (
              <option key={z.id} value={z.id}>
                {z.numeracion} - {z.usuario 
                    ? `${z.usuario.nombre} ${z.usuario.apellidoPaterno} ${z.usuario.apellidoMaterno}` 
                    : "Sin usuario"}
              </option>
            ))}
          </select>
        </div>

        {/* Are */}
        <div className="asignacioneszoreare-form-group">
          <label>Are</label>
          <select
            name="areId"
            value={formData.areId}
            onChange={handleChange}
            disabled={!formData.zoreId}
            required
          >
            <option value="">Seleccionar Are...</option>
            {ares.map((a) => (
              <option key={a.id} value={a.id}>
                {a.numeracion} - {a.usuario 
                    ? `${a.usuario.nombre} ${a.usuario.apellidoPaterno} ${a.usuario.apellidoMaterno}` 
                    : "Sin usuario"}
              </option>
            ))}
          </select>
        </div>

        {messageForm && (
          <div className={`asignacioneszoreare-message-form ${messageFormType}`}>
            {messageForm}
          </div>
        )}

        <button type="submit" className="asignacioneszoreare-btn-guardar">
          Crear Asignación
        </button>
      </form>

      {/* Modal edición (idéntico en comportamiento pero más breve) */}
      {showModal && editData && (
        <div className="asignacioneszoreare-modal">
          <div className="asignacioneszoreare-modal-content edit">
            <h3 className="asignacioneszoreare-modal-title">Editar Asignación</h3>
            <form className="asignacioneszoreare-modal-form-grid">
              <div className="asignacioneszoreare-modal-form-group">
                <label>Año</label>
                <select
                  name="anio"
                  value={editFormData.anio}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, anio: e.target.value })
                  }
                >
                  <option value="">Seleccionar año...</option>
                  {anios.map((a, i) => (
                    <option key={a.id || i} value={String(a.anio)}>
                      {a.anio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="asignacioneszoreare-modal-form-group">
                <label>Zore</label>
                <select
                  name="zoreId"
                  value={editFormData.zoreId}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, zoreId: e.target.value })
                  }
                  disabled={!editFormData.anio}
                  required
                >
                  <option value="">Seleccionar Zore...</option>
                  {zores.map((z) => (
                    <option key={z.id} value={String(z.id)}>
                      {z.numeracion} - {z.usuario ? `${z.usuario.nombre} ${z.usuario.apellidoPaterno}` : "Sin usuario"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="asignacioneszoreare-modal-form-group">
                <label>Are</label>
                <select
                  name="areId"
                  value={editFormData.areId}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, areId: e.target.value })
                  }
                  disabled={!editFormData.zoreId}
                  required
                >
                  <option value="">Seleccionar Are...</option>
                  {ares.map((a) => (
                    <option key={a.id} value={String(a.id)}>
                      {a.numeracion} - {a.usuario ? `${a.usuario.nombre} ${a.usuario.apellidoPaterno}` : "Sin usuario"}
                    </option>
                  ))}
                </select>
              </div>

              {messageModal && (
                <div
                  className={`asignacioneszoreare-modal-message ${messageModalType}`}
                >
                  {messageModal}
                </div>
              )}

              <div className="asignacioneszoreare-modal-buttons">
                <button
                  type="button"
                  className="asignacioneszoreare-btn-guardar"
                  onClick={handleUpdate}
                  disabled={loadingModal}
                >
                  {loadingModal ? (
                    <>
                      Procesando...{" "}
                      <FaSpinner className="asignacioneszoreare-spinner" />
                    </>
                  ) : (
                    "Guardar"
                  )}
                </button>
                <button
                  type="button"
                  className="asignacioneszoreare-btn-cancelar"
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

export default AsignacionesZoreAre;
