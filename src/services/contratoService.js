// src/services/contratoService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:8080/rrhh";

export const contratoService = {
  listar: (auth, page = 0, size = 20) =>
    fetchWithAuth(`${API_URL}/contratos/paginado?page=${page}&size=${size}`, { method: "GET" }, auth),
  obtenerPorId: (auth, id) =>
    fetchWithAuth(`${API_URL}/contrato/${id}`, { method: "GET" }, auth),
  crear: (auth, data) =>
    fetchWithAuth(`${API_URL}/contrato`, { method: "POST", body: JSON.stringify(data) }, auth),
  actualizar: (auth, id, data) =>
    fetchWithAuth(`${API_URL}/contrato/${id}`, { method: "PUT", body: JSON.stringify(data) }, auth),
  eliminar: (auth, id) =>
    fetchWithAuth(`${API_URL}/contrato/${id}`, { method: "DELETE" }, auth),
};
