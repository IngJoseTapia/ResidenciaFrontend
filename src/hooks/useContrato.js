//src/hooks/useContrato.js
import { useContext } from "react";
import { ContratoContext } from "../context/ContratoContext";

export const useContrato = () => useContext(ContratoContext);
