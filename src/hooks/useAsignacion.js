// src/context/useAsignacion.js
import { useContext } from "react";
import { AsignacionContext } from "../context/AsignacionContext";

export const useAsignacion = () => {
  const context = useContext(AsignacionContext);
  if (!context) {
    throw new Error("useAsignacion debe usarse dentro de un AsignacionProvider");
  }
  return context;
};
