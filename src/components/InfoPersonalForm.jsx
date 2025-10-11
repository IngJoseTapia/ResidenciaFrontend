// src/components/InfoPersonalForm.jsx
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import "../styles/Dashboard.css";

const InfoPersonalForm = ({ user, updateUserInfo }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    genero: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" o "error"

  // Sincronizar datos del usuario
  useEffect(() => {
    if (!user) return;
    setFormData({
      nombre: user.nombre || "",
      apellidoPaterno: user.apellidoPaterno || "",
      apellidoMaterno: user.apellidoMaterno || "",
      correo: user.correo || "",
      telefono: user.telefono || "",
      genero: user.genero || "",
    });
  }, [user]);

  // Limpieza automática de mensajes
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(
      () => setMessage(""),
      messageType === "success" ? 4000 : 8000
    );
    return () => clearTimeout(timeout);
  }, [message, messageType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const result = await updateUserInfo(formData);
      setMessage(result.message || (result.success ? "Actualización exitosa" : "Error al actualizar"));
      setMessageType(result.success ? "success" : "error");
    } catch (err) {
      console.error(err);
      setMessage("Error al actualizar la información.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="perfil-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Correo</label>
        <p className="readonly-field">{formData.correo}</p>
      </div>
      <div className="form-group">
        <label>Nombre</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Apellido Paterno</label>
        <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Apellido Materno</label>
        <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Teléfono</label>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Género</label>
        <select name="genero" value={formData.genero} onChange={handleChange} required>
          <option value="">Seleccione...</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      {message && <div className={`form-message ${messageType}`}>{message}</div>}

      <button type="submit" className="btn-guardar" disabled={loading}>
        {loading ? <FaSpinner className="spinner" /> : "Guardar cambios"}
      </button>
    </form>
  );
};

export default InfoPersonalForm;
