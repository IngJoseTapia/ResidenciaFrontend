// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

let refreshPromise = null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(localStorage.getItem("jwt") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [authError, setAuthError] = useState(""); // 🔹 nuevo estado para errores globales

  const logout = useCallback(() => {
    setUser(null);
    setJwt(null);
    setRefreshToken(null);
    setJustLoggedIn(false);
    setAuthError(""); // 🔹 limpiar error al hacer logout
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
  }, []);

  const refreshJwt = useCallback(async () => {
    if (!refreshToken) {
      logout();
      return null;
    }

    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          logout();
          return null;
        }

        const data = await response.json();

        if (!data?.token) {
          logout();
          return null;
        }

        setJwt(data.token);
        localStorage.setItem("jwt", data.token);

        if (data.refreshToken) {
          setRefreshToken(data.refreshToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        try {
          const decoded = jwtDecode(data.token);
          setUser({
            token: data.token,
            correo: decoded.email || decoded.sub,
            role: decoded.role || decoded.roles || "USER",
          });
        } catch (err) {
          console.warn("No se pudo decodificar el token tras refresh:", err);
        }

        return data.token;
      } catch (error) {
        console.error("Error en refresh token:", error);
        logout();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }, [refreshToken, logout]);

  useEffect(() => {
    if (!jwt) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(jwt);
      setUser({
        token: jwt,
        correo: decoded.email || decoded.sub,
        role: decoded.role || decoded.roles || "USER",
      });
    } catch (err) {
      console.error("Error decodificando token:", err);
      logout();
    }
  }, [jwt, logout]);

  useEffect(() => {
    if (!jwt || justLoggedIn) return;

    let timerId = null;
    try {
      const decoded = jwtDecode(jwt);
      const expTimeMs = decoded.exp * 1000;
      const msUntilRefresh = expTimeMs - Date.now() - 60_000;

      if (msUntilRefresh > 0) {
        timerId = setTimeout(async () => {
          try {
            await refreshJwt();
          } catch (err) {
            console.error("Auto-refresh falló:", err);
          }
        }, msUntilRefresh);
      } else {
        (async () => {
          try {
            await refreshJwt();
          } catch (err) {
            console.error("Auto-refresh inmediato falló:", err);
          }
        })();
      }
    } catch (err) {
      console.error("Error en auto-refresh (jwt decode):", err);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      setJustLoggedIn(false);
    };
  }, [jwt, refreshJwt, justLoggedIn]);

  // 🔹 Login normal con manejo de error
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setAuthError(data.mensaje || "Error en login"); // 🔹 guardar error
        return { success: false, message: data.mensaje || "Error en login" };
      }

      setJwt(data.token);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      try {
        const decoded = jwtDecode(data.token);
        setUser({
          token: data.token,
          correo: decoded.email || decoded.sub,
          role: decoded.role || decoded.roles || "USER",
        });
      } catch (err) {
        console.warn("No se pudo decodificar token al loguear:", err);
      }

      setAuthError(""); // 🔹 limpiar error si login exitoso
      setJustLoggedIn(true);

      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      setAuthError(error.message); // 🔹 guardar error
      return { success: false, message: error.message };
    }
  };

  // 🔹 Login con Google con manejo de error
  const loginWithGoogle = (data) => {
    if (data.error) {
      setAuthError(data.error); // 🔹 guardar error de Google
      setUser(null);
      return;
    }

    if (data.token && data.refreshToken) {
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setJwt(data.token);
      setRefreshToken(data.refreshToken);

      try {
        const decoded = jwtDecode(data.token);
        setUser({
          token: data.token,
          correo: decoded.email || decoded.sub,
          role: decoded.role || decoded.roles || "USER",
        });
      } catch (err) {
        console.warn("No se pudo decodificar token google:", err);
      }

      setAuthError(""); // 🔹 limpiar error si login exitoso
      setJustLoggedIn(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        jwt,
        login,
        logout,
        refreshJwt,
        loginWithGoogle,
        authError, // 🔹 exponemos el error
        setAuthError, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
