//src/services/logsService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

/**
 * Obtiene logs de acuerdo al tipo solicitado
 * @param {"login"|"sistema"|"correos"} tipo - Tipo de log a consultar
 * @param {number} page - Página actual
 * @param {number} size - Tamaño de página (por defecto 50)
 * @param {object} authContext - { jwt, refreshJwt, logout }
 */
export const getLogsByTipo = async (tipo = "sistema", page = 0, size = 50, authContext) => {
  try {
    const validTypes = ["login", "sistema", "correos"];
    if (!validTypes.includes(tipo)) {
      throw new Error(`Tipo de log inválido: ${tipo}`);
    }

    const url = `${import.meta.env.VITE_API_URL}/admin/logs/${tipo}?page=${page}&size=${size}`;

    const data = await fetchWithAuth(
      url,
      { method: "GET" },
      authContext
    );

    return {
      content: Array.isArray(data.content) ? data.content : [],
      number: data.number ?? 0,
      totalPages: data.totalPages ?? 0,
      totalElements: data.totalElements ?? 0,
    };
  } catch (err) {
    console.error(`Error en getLogsByTipo (${tipo}):`, err);
    throw err;
  }
};
