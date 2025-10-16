// src/utils/fetchWithAuth.js
import { jwtDecode } from "jwt-decode";

/**
 * Verifica si el JWT ya expiró
 */
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

/**
 * Fetch con manejo de autenticación y refresh token
 * @param {string} url - URL del endpoint
 * @param {object} options - Opciones del fetch (method, body, headers, etc)
 * @param {object} authContext - { jwt, refreshJwt, logout }
 * @returns {Promise<any>} - JSON del endpoint
 */
export const fetchWithAuth = async (url, options = {}, { jwt, refreshJwt, logout }) => {
  let tokenToUse = jwt;

  // 🔹 Si el token expiró, intenta refrescarlo antes de hacer fetch
  if (isTokenExpired(jwt)) {
    tokenToUse = await refreshJwt();
    if (!tokenToUse) {
      logout();
      throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
    }
  }

  const doFetch = async (token) => {
    if (!token) {
      logout();
      throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
    }

    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  };

  try {
    // 🔹 Primer intento
    let response = await doFetch(tokenToUse);

    // 🔹 Si retorna 401 o 403, intenta refrescar y reintentar
    if (response.status === 401 || response.status === 403) {
      tokenToUse = await refreshJwt();
      if (!tokenToUse) {
        logout();
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }

      response = await doFetch(tokenToUse);
    }

    // 🔹 Si aún falla, lanzar error
    if (!response.ok) {
      let errorMessage = "Error en la petición";

      try {
        const errorData = await response.json(); // Intentar parsear JSON
        if (errorData.mensaje) {
          errorMessage = errorData.mensaje; // Usar el mensaje del backend
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        }
      } catch {
        const text = await response.text();
        if (text) errorMessage = text;
      }

      throw new Error(errorMessage);
    }

    // 🧩 NUEVA LÓGICA: manejar respuestas vacías o sin JSON
    const text = await response.text(); // obtenemos la respuesta como texto primero
    if (!text) {
      return {}; // si está vacía, devolvemos un objeto vacío
    }

    // 🔹 Retornar JSON directamente
    try {
      return JSON.parse(text); // intentamos parsear JSON si existe
    } catch (e) {
      console.warn("Respuesta no JSON del servidor:", text);
      console.log(e);
      return {}; // si no es JSON válido, devolvemos vacío para no romper el flujo
    }
  } catch (err) {
    console.error("Error en fetchWithAuth:", err);
    throw err;
  }
};
