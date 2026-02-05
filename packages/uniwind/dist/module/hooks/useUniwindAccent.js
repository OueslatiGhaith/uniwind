import { formatColor } from "../core/web/formatColor.js";
import { useResolveClassNames } from "./useResolveClassNames.js";
export const useUniwindAccent = (className) => {
  const styles = useResolveClassNames(className ?? "");
  return styles.accentColor !== void 0 ? formatColor(styles.accentColor) : void 0;
};
