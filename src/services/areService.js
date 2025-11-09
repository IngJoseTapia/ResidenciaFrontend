//src/services/areService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:8080/admin";

export const areService = {
  // 🔹 Listar Ares con paginación
  listarPaginadas: (auth, page = 0, size = 20) =>
    fetchWithAuth(`${API_URL}/are?page=${page}&size=${size}`, { method: "GET" }, auth),

  // 🔹 Crear una nueva Are
  crear: (auth, data) =>
    fetchWithAuth(`${API_URL}/are`, {
      method: "POST",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Actualizar una Are existente
  actualizar: (auth, id, data) =>
    fetchWithAuth(`${API_URL}/are/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Listar usuarios con rol CAE (para asignación)
  listarUsuariosRolCAE: (auth) =>
    fetchWithAuth(`${API_URL}/usuarios/rol-cae`, { method: "GET" }, auth),
};
