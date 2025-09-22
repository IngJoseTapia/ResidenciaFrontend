// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error en el inicio de sesión");
  }

  return await response.json(); // { jwt, refreshToken }
}

export async function register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error en el registro");
  }

  return await response.text(); // mensaje del backend
}
