// src/hooks/useConsultaUsuarios.js
import { useContext } from "react";
import { ConsultaUsuariosContext } from "../context/ConsultaUsuariosContext";

export const useConsultaUsuarios = () => {
  const context = useContext(ConsultaUsuariosContext);
  if (!context) {
    throw new Error("useConsultaUsuarios debe usarse dentro de un ConsultaUsuariosProvider");
  }
  return context;
};
