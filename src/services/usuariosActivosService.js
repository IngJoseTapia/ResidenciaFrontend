// src/services/usuariosActivosService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

/**
 * Obtiene la lista de usuarios activos paginada
 */
export const getUsuariosActivos = async (page = 0, size = 10, authContext) => {
  try {
    const data = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/vocal/activos?page=${page}&size=${size}`,
      { method: "GET" },
      authContext
    );

    // 🔹 data ya es JSON
    return {
      content: Array.isArray(data.content) ? data.content : [],
      number: typeof data.number === "number" ? data.number : 0,
      totalPages: typeof data.totalPages === "number" ? data.totalPages : 0,
      totalElements: typeof data.totalElements === "number" ? data.totalElements : 0,
    };
  } catch (err) {
    console.error("Error en getUsuariosActivos:", err);
    throw err; // lanza el error original para depuración
  }
};

/**
 * Cambia el rol de un usuario
 */
export const cambiarRolUsuario = async (id, rol, authContext) => {
  try {
    const res = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/vocal/usuarios/${id}/rol`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol }),
      },
      authContext
    );

    // 🔹 fetchWithAuth ya devuelve el JSON parseado
    if (!res) throw new Error("Error al cambiar rol");

    return res;
  } catch (err) {
    console.error("Error en cambiarRolUsuario:", err);
    throw err;
  }
};
