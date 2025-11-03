//src/hooks/useUsuarioContrato.js
import { useContext } from "react";
import { UsuarioContratoContext } from "../context/UsuarioContratoContext";

export const useUsuarioContrato = () => useContext(UsuarioContratoContext);
