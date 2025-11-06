//src/hooks/useMunicipio.js
import { useContext } from "react";
import { MunicipioContext } from "../context/MunicipioContext";

export const useMunicipio = () => useContext(MunicipioContext);
