// src/utils/fetchWithAuth.js
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export const fetchWithAuth = async (url, options = {}, { jwt, refreshJwt, logout }) => {
  let tokenToUse = jwt;

  // 🔹 Si ya expiró el token, intenta refrescar antes de hacer la llamada
  if (isTokenExpired(jwt)) {
    const newToken = await refreshJwt();
    if (!newToken) {
      logout();
      throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
    }
    tokenToUse = newToken;
  }

  const doFetch = async (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  try {
    // 🔹 Primer intento con el token actual
    let response = await doFetch(tokenToUse);

    // 🔹 Si expira el token (401 o 403), intentar refrescar
    if (response.status === 401 || response.status === 403) {
      const newToken = await refreshJwt(); // 🔹 intenta renovar

      if (!newToken) {
        logout();
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }

      // 🔹 Reintentar con token renovado
      response = await doFetch(newToken);
    }

    return response;
  } catch (err) {
    console.error("Error en fetchWithAuth:", err);
    throw err;
  }
};
