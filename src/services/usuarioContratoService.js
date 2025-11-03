// src/services/usuarioContratoService.js
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:8080/rrhh";

export const usuarioContratoService = {
  // 🔹 Crear una nueva asignación de contrato
  asignar: (auth, data) =>
    fetchWithAuth(`${API_URL}/usuario-contrato/asignar`, {
      method: "POST",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Actualizar un vínculo usuario-contrato
  actualizar: (auth, id, data) =>
    fetchWithAuth(`${API_URL}/usuario-contrato/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, auth),

  // 🔹 Obtener vínculos paginados
  listarPaginado: (auth, page = 0, size = 20) =>
    fetchWithAuth(`${API_URL}/usuario-contratos/paginado?page=${page}&size=${size}`, {
      method: "GET",
    }, auth),

  // 🔹 Obtener lista de contratos activos (para dropdown)
  listarContratosActivos: (auth) =>
    fetchWithAuth(`${API_URL}/contratos/activos`, { method: "GET" }, auth),

  // 🔹 Obtener lista de usuarios activos (para dropdown)
  listarUsuariosActivos: (auth) =>
    fetchWithAuth(`${API_URL}/usuarios/activos`, { method: "GET" }, auth),
};
