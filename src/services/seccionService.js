//src/services/seccionService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:8080/admin";

export const seccionService = {
  // 🔹 Listar secciones con paginación
  listarPaginadas: (auth, page = 0, size = 20) =>
    fetchWithAuth(`${API_URL}/seccion/paginadas?page=${page}&size=${size}`, { method: "GET" }, auth),

  // 🔹 Listar todas las secciones (sin paginación)
  listarTodas: (auth) =>
    fetchWithAuth(`${API_URL}/seccion`, { method: "GET" }, auth),

  // 🔹 Crear nueva sección
  crear: (auth, data) =>
    fetchWithAuth(`${API_URL}/seccion`, {
      method: "POST",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Actualizar sección existente
  actualizar: (auth, id, data) =>
    fetchWithAuth(`${API_URL}/seccion/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Listar localidades (para asignarlas a la sección)
  listarLocalidades: (auth) =>
    fetchWithAuth(`${API_URL}/localidad`, { method: "GET" }, auth),

    // 🔹 Listar asignaciones Zore-Are por año (simple)
  listarAsignacionesPorAnio: (auth, anio) =>
    fetchWithAuth(`${API_URL}/asignacion-zore-are/simple-por-anio?anio=${anio}`, { method: "GET" }, auth),

  // 🔹 Listar localidades por municipio
  listarLocalidadesPorMunicipio: (auth, municipioId) =>
    fetchWithAuth(`${API_URL}/localidad/por-municipio/${municipioId}`, { method: "GET" }, auth),
};
