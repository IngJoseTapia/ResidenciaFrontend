//src/services/zoreService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:8080/admin";

export const zoreService = {
  // 🔹 Listar Zores con paginación
  listarPaginadas: (auth, page = 0, size = 20) =>
    fetchWithAuth(`${API_URL}/zore?page=${page}&size=${size}`, { method: "GET" }, auth),

  // 🔹 Crear una nueva Zore
  crear: (auth, data) =>
    fetchWithAuth(`${API_URL}/zore`, {
      method: "POST",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Actualizar una Zore existente
  actualizar: (auth, id, data) =>
    fetchWithAuth(`${API_URL}/zore/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Listar usuarios con rol SE (para asignación)
  listarUsuariosRolSE: (auth) =>
    fetchWithAuth(`${API_URL}/usuarios/rol-se`, { method: "GET" }, auth),
};
