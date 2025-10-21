// src/context/useUsuariosActivos.js
import { useContext } from "react";
import { UsuariosActivosContext } from "../context/UsuariosActivosContext";

export const useUsuariosActivos = () => {
  const context = useContext(UsuariosActivosContext);
  if (!context) throw new Error("useUsuariosActivos debe usarse dentro de un UsuariosActivosProvider");
  return context;
};
