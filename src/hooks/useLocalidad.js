//src/hooks/useLocalidad.js
import { useContext } from "react";
import { LocalidadContext } from "../context/LocalidadContext";

export const useLocalidad = () => useContext(LocalidadContext);
