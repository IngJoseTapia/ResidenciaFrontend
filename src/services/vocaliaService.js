// src/services/vocaliaService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:8080/admin/vocalia";

export const vocaliaService = {
  listar: (auth) => fetchWithAuth(`${API_URL}`, { method: "GET" }, auth),
  crear: (auth, data) => fetchWithAuth(`${API_URL}`, { method: "POST", body: JSON.stringify(data) }, auth),
  actualizar: (auth, id, data) => fetchWithAuth(`${API_URL}/${id}`, { method: "PUT", body: JSON.stringify(data) }, auth),
  eliminar: (auth, id) => fetchWithAuth(`${API_URL}/${id}`, { method: "DELETE" }, auth),
};