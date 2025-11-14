//src/hooks/useSeccion.js
import { useContext } from "react";
import { SeccionContext } from "../context/SeccionContext";

export const useSeccion = () => useContext(SeccionContext);
