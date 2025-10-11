// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

let refreshPromise = null; // Previene múltiples refresh simultáneos

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(localStorage.getItem("jwt") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true); // 🔹 Nuevo estado

  // 🔹 Logout centralizado
  const logout = useCallback(() => {
    setUser(null);
    setJwt(null);
    setRefreshToken(null);
    setAuthError("");
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
  }, []);

  // 🔹 Refresh token seguro
  const refreshJwt = useCallback(async () => {
    if (!refreshToken) {
      logout();
      return null;
    }

    if (refreshPromise) return refreshPromise;

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
            role: decoded.rol || "USER",
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

  // 🔹 Inicializar usuario desde token
  useEffect(() => {
    if (!jwt) {
      setUser(null);
      setLoading(false); // Termina carga
      return;
    }

    try {
      const decoded = jwtDecode(jwt);
      setUser({
        token: jwt,
        correo: decoded.email || decoded.sub,
        role: decoded.rol || "USER",
      });
    } catch (err) {
      console.error("Error decodificando token:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [jwt, logout]);

  // 🔹 Auto-refresh
  useEffect(() => {
    if (!jwt) return;

    let timerId;
    try {
      const decoded = jwtDecode(jwt);
      const msUntilRefresh = decoded.exp * 1000 - Date.now() - 60_000;

      if (msUntilRefresh > 0) {
        timerId = setTimeout(refreshJwt, msUntilRefresh);
      } else {
        refreshJwt();
      }
    } catch (err) {
      console.error("Error en auto-refresh (jwt decode):", err);
    }

    return () => timerId && clearTimeout(timerId);
  }, [jwt, refreshJwt]);

  // 🔹 Login normal
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setAuthError(data.mensaje || "Error en login");
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
          role: decoded.rol || "USER",
        });
      } catch (err) {
        console.warn("No se pudo decodificar token al loguear:", err);
      }

      setAuthError("");
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      setAuthError(error.message);
      return { success: false, message: error.message };
    }
  };

  // 🔹 Login Google
  const loginWithGoogle = (data) => {
    if (data.error) {
      setAuthError(data.error);
      setUser(null);
      return { success: false, message: data.error };
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
          role: decoded.rol || "USER",
        });
      } catch (err) {
        console.warn("No se pudo decodificar token google:", err);
      }

      setAuthError("");
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        jwt,
        loading, // 🔹 agregamos loading
        login,
        logout,
        refreshJwt,
        loginWithGoogle,
        authError,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
