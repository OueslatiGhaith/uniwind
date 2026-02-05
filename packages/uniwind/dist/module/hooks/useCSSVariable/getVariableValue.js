import { parseCSSValue } from "../../core/web/index.js";
const documentStyles = typeof document !== "undefined" ? window.getComputedStyle(document.documentElement) : null;
export const getVariableValue = (name) => {
  if (!documentStyles) {
    return void 0;
  }
  const value = documentStyles.getPropertyValue(name).trim();
  if (value === "") {
    return void 0;
  }
  return parseCSSValue(value);
};
