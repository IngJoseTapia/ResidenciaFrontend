// src/services/consultaUsuariosService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

/**
 * Obtiene la lista de todos los usuarios (solo admin) con paginación
 */
export const getConsultaUsuarios = async (page = 0, size = 20, authContext) => {
  try {
    const data = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/admin/usuarios?page=${page}&size=${size}`,
      { method: "GET" },
      authContext
    );

    // 🔹 data ya viene en formato JSON desde fetchWithAuth
    return {
      content: Array.isArray(data.content) ? data.content : [],
      number: typeof data.number === "number" ? data.number : 0,
      totalPages: typeof data.totalPages === "number" ? data.totalPages : 0,
      totalElements: typeof data.totalElements === "number" ? data.totalElements : 0,
    };
  } catch (err) {
    console.error("Error en getConsultaUsuarios:", err);
    throw err;
  }
};

/**
 * Elimina un usuario con status INACTIVO
 * @param {number} usuarioId - ID del usuario a eliminar
 * @param {object} authContext - { jwt, refreshJwt, logout }
 * @returns {Promise<object>} - respuesta del backend
 */
export const eliminarUsuarioInactivo = async (usuarioId, authContext) => {
  try {
    return await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/admin/eliminar/${usuarioId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      },
      authContext
    );
  } catch (err) {
    console.error("Error en eliminarUsuarioInactivo:", err);
    throw err;
  }
};

/**
 * Cambia el correo electrónico de un usuario
 * @param {number} usuarioId
 * @param {string} nuevoCorreo
 * @param {object} authContext
 */
export const cambiarCorreoUsuario = async (usuarioId, nuevoCorreo, authContext) => {
  try {
    return await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/admin/usuario/${usuarioId}/correo`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevoCorreo }),
      },
      authContext
    );
  } catch (err) {
    console.error("Error en cambiarCorreoUsuario:", err);
    throw err;
  }
};

/**
 * Cambia la contraseña de un usuario
 * @param {number} usuarioId
 * @param {string} nuevaContrasena
 * @param {object} authContext
 */
export const cambiarContrasenaUsuario = async (usuarioId, nuevaContrasena, authContext) => {
  try {
    return await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/admin/usuario/${usuarioId}/password`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevaPassword: nuevaContrasena })
      },
      authContext
    );
  } catch (err) {
    console.error("Error en cambiarContrasenaUsuario:", err);
    throw err;
  }
};

/**
 * Cambia el status (ACTIVO/INACTIVO) de un usuario
 * @param {number} usuarioId
 * @param {string} nuevoStatus - Puede ser "ACTIVO" o "INACTIVO"
 * @param {object} authContext
 */
export const cambiarStatusUsuario = async (usuarioId, nuevoStatus, authContext) => {
  try {
    return await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/admin/usuario/${usuarioId}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevoStatus }),
      },
      authContext
    );
  } catch (err) {
    console.error("Error en cambiarStatusUsuario:", err);
    throw err;
  }
};