//src/services/asignacionZoreAreService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:8080/admin";

export const asignacionZoreAreService = {
  // 🔹 Listar asignaciones con paginación
  listarPaginadas: (auth, page = 0, size = 20) =>
    fetchWithAuth(`${API_URL}/asignacion-zore-are?page=${page}&size=${size}`, { method: "GET" }, auth),

  // 🔹 Crear nueva asignación ZORE–ARE
  crear: (auth, data) =>
    fetchWithAuth(`${API_URL}/asignacion-zore-are`, {
      method: "POST",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Actualizar asignación existente
  actualizar: (auth, id, data) =>
    fetchWithAuth(`${API_URL}/asignacion-zore-are/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Listar años disponibles (para dropdown)
  listarAniosZore: (auth) =>
    fetchWithAuth(`${API_URL}/zore/anos`, { method: "GET" }, auth),

  // 🔹 Listar ZORE por año seleccionado
  listarZoresPorAnio: (auth, anio) =>
    fetchWithAuth(`${API_URL}/zore/por-anio?anio=${anio}`, { method: "GET" }, auth),

  // 🔹 Listar ARE disponibles por año (sin asignar)
  listarAresPorAnio: (auth, anio) =>
    fetchWithAuth(`${API_URL}/are/por-anio?anio=${anio}`, { method: "GET" }, auth),

  // 🔹 Listar ARE por anio incluyendo un id específico (útil para edición)
  listarAresPorAnioIncluyendo: (auth, anio, includeId) => {
    const includeParam = includeId ? `&includeId=${includeId}` : "";
    return fetchWithAuth(`${API_URL}/are/por-anio?anio=${anio}${includeParam}`, { method: "GET" }, auth);
  },
};
