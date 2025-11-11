// src/services/localidadService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:8080/admin/localidad";

export const localidadService = {
  // 🔹 Listar todas las localidades
  listar: (auth) =>
    fetchWithAuth(`${API_URL}`, { method: "GET" }, auth),

  // 🔹 Listar con paginación
  listarPaginadas: (auth, page = 0, size = 20) =>
    fetchWithAuth(`${API_URL}/paginadas?page=${page}&size=${size}`, { method: "GET" }, auth),

  // 🔹 Crear nueva localidad
  crear: (auth, data) =>
    fetchWithAuth(
      `${API_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroLocalidad: data.numeroLocalidad,
          nombre: data.nombre,
          municipioId: data.municipioId,
        }),
      },
      auth
    ),

  // 🔹 Actualizar localidad
  actualizar: (auth, id, data) =>
    fetchWithAuth(
      `${API_URL}/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroLocalidad: data.numeroLocalidad,
          nombre: data.nombre,
          municipioId: data.municipioId,
        }),
      },
      auth
    ),

  // 🔹 Eliminar localidad
  eliminar: (auth, id) =>
    fetchWithAuth(`${API_URL}/${id}`, { method: "DELETE" }, auth),
};
