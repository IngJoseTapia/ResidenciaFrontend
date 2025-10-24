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