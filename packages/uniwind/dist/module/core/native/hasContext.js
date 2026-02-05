import { createContext, useContext } from "react";
export const HasContext = createContext(null);
export const useHasContext = () => useContext(HasContext);
