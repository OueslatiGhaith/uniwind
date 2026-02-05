import { useEffect, useReducer } from "react";
import { CSSListener, getWebStyles } from "../core/web/index.js";
const emptyState = {};
export const useResolveClassNames = (className) => {
  const [styles, recreate] = useReducer(
    () => className !== "" ? getWebStyles(className) : emptyState,
    className !== "" ? getWebStyles(className) : emptyState
  );
  useEffect(() => {
    if (className === "") {
      return;
    }
    recreate();
    const dispose = CSSListener.subscribeToClassName(className, recreate);
    return dispose;
  }, [className]);
  return styles;
};
