// src/services/asignacionService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

/**
 * Obtiene la lista de usuarios con status PENDIENTE.
 * Retorna un objeto con content[], number, totalPages y totalElements
 */
export const getUsuariosPendientes = async (page = 0, size = 20, authContext) => {
  try {
    const data = await fetchWithAuth(
      `http://localhost:8080/admin/pendientes?page=${page}&size=${size}`,
      { method: "GET" },
      authContext
    );

    // 🔹 Transformamos la respuesta para asegurar consistencia
    return {
      content: Array.isArray(data.content) ? data.content : [],
      number: typeof data.number === "number" ? data.number : 0,
      totalPages: typeof data.totalPages === "number" ? data.totalPages : 0,
      totalElements: typeof data.totalElements === "number" ? data.totalElements : 0,
    };
  } catch (err) {
    console.error("Error en getUsuariosPendientes:", err);
    throw err;
  }
};

/**
 * Asigna una vocalía a un usuario.
 */
export const asignarVocalia = async (usuarioId, vocaliaId, authContext) => {
  try {
    return await fetchWithAuth(
      "http://localhost:8080/admin/asignar-vocalia",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, vocaliaId }), // ✅ correcto
      },
      authContext
    );
  } catch (err) {
    console.error("Error en asignarVocalia:", err);
    throw err;
  }
};

/**
 * Elimina un usuario con status PENDIENTE
 * @param {number} usuarioId - ID del usuario a eliminar
 * @param {object} authContext - { jwt, refreshJwt, logout }
 * @returns {Promise<object>} - respuesta del backend
 */
export const eliminarUsuarioPendiente = async (usuarioId, authContext) => {
  try {
    return await fetchWithAuth(
      `http://localhost:8080/admin/eliminar-pendiente/${usuarioId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      },
      authContext
    );
  } catch (err) {
    console.error("Error en eliminarUsuarioPendiente:", err);
    throw err;
  }
};
