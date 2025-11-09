//src/hooks/useZore.js
import { useContext } from "react";
import { ZoreContext } from "../context/ZoreContext";

export const useZore = () => useContext(ZoreContext);
