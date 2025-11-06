// src/tabs/UsuariosActivos.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaSpinner } from "react-icons/fa";
import "../styles/UsuariosActivos.css";
import Pagination from "../components/Pagination";
import { useUsuariosActivos } from "../hooks/useUsuariosActivos";

const rolesDisponibles = ["ADMIN", "VOCAL", "RRHH", "CAE", "SE", "TECNICO", "CAPTURISTA", "AUXILIAR", "MONITORISTA", "VALIDADOR", "USER"];

const UsuariosActivos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");
  const [loadingAssign, setLoadingAssign] = useState(false);
  const timeoutRef = useRef(null);

  const { usuarios, setUsuarios, pageInfo, loading, fetchUsuarios, cambiarRol } = useUsuariosActivos();

  /** 🔹 Abrir modal */
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.rol);
    setModalMessage("");
    setModalMessageType("");
    setModalOpen(true);
  };

  /** 🔹 Cerrar modal y limpiar mensajes */
  const handleCloseModal = () => {
    setSelectedUser(null);
    setNewRole("");
    setModalMessage("");
    setModalMessageType("");
    setModalOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  /** 🔹 Guardar nuevo rol */
  const handleSaveRole = async (e) => {
    e.preventDefault();

    if (!newRole) {
      setModalMessage("Selecciona un rol antes de guardar ❗");
      setModalMessageType("warning");
      return;
    }

    setLoadingAssign(true);
    setModalMessage("Procesando...");
    setModalMessageType("info");

    try {
      const res = await cambiarRol(selectedUser.id, newRole);

      if (res.success) {
        // ✅ Éxito
        setModalMessage(res.message);
        setModalMessageType("success");

        // Actualizar el rol del usuario sin recargar toda la tabla
        setUsuarios((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? { ...u, rol: newRole } : u))
        );

        // Cerrar modal después de 3 segundos
        timeoutRef.current = setTimeout(() => {
          handleCloseModal();
        }, 3000);
      } else {
        // ❌ Error del backend
        setModalMessage(res.message);
        setModalMessageType("error");

        // Ocultar mensaje tras unos segundos
        timeoutRef.current = setTimeout(() => {
          setModalMessage("");
          setModalMessageType("");
        }, 4000);
      }
    } catch (err) {
      // ⚠️ Error inesperado
      setModalMessage(err.message || "Error inesperado ❌");
      setModalMessageType("error");
    } finally {
      setLoadingAssign(false);
    }
  };

  /** 🔹 Paginación */
  const handlePrev = () => pageInfo.page > 0 && fetchUsuarios(pageInfo.page - 1);
  const handleNext = () => pageInfo.page < pageInfo.totalPages - 1 && fetchUsuarios(pageInfo.page + 1);

  /** 🔹 Limpieza de timeouts */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="usuarios-activos-container">
      <h2 className="usuarios-activos-title">Usuarios Activos</h2>

      {loading ? (
        <div className="loading">
          <FaSpinner className="spinner" /> Cargando usuarios...
        </div>
      ) : (
        <div className="activos-form-table">
          <table className="usuarios-activos-table">
            <thead>
              <tr>
                <th>Correo</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Rol</th>
                <th>Fecha Registro</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="7">No hay usuarios activos</td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.correo}</td>
                    <td>{u.nombre}</td>
                    <td>{u.apellidoPaterno}</td>
                    <td>{u.apellidoMaterno}</td>
                    <td>{u.rol}</td>
                    <td>{new Date(u.fechaRegistro).toLocaleDateString("es-MX")}</td>
                    <td className="activos-action-cell">
                      <button
                        className="activos-btn editar"
                        onClick={() => handleOpenModal(u)}
                        disabled={loadingAssign}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Controles de paginación */}
      <Pagination
        currentPage={pageInfo.page}
        totalPages={pageInfo.totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* 🔹 Modal asignación de rol */}
      {modalOpen && selectedUser && (
        <div className="modal">
          <div className="modal-content edit">
            <h3 className="modal-title">Asignar Rol</h3>

            <form onSubmit={handleSaveRole} className="modal-form">
              <div className="modal-form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  value={`${selectedUser.nombre} ${selectedUser.apellidoPaterno} ${selectedUser.apellidoMaterno}`}
                  disabled
                />
              </div>

              <div className="modal-form-group">
                <label>Rol</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                  disabled={loadingAssign}
                >
                  <option value="">-- Seleccionar rol --</option>
                  {rolesDisponibles.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
              </div>

              {modalMessage && (
                <div className={`form-message-modal ${modalMessageType}`}>
                  {modalMessage}
                </div>
              )}

              <div className="modal-buttons">
                <button type="submit" className="btn-guardar" disabled={loadingAssign}>
                  {loadingAssign ? (
                    <>
                      <FaSpinner className="spinner" /> Procesando...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={handleCloseModal}
                  disabled={loadingAssign}
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosActivos;
