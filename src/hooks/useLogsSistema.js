//src/hooks/useLogsSistema.js
import { useContext } from "react";
import { LogsSistemaContext } from "../context/LogsSistemaContext";

export const useLogsSistema = () => {
  const context = useContext(LogsSistemaContext);
  if (!context) {
    throw new Error("useLogsSistema debe usarse dentro de un LogsSistemaProvider");
  }
  return context;
};
