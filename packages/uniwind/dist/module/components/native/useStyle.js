import { useEffect, useReducer } from "react";
import { UniwindListener } from "../../core/listener.js";
import { UniwindStore } from "../../core/native/index.js";
import { useGroupContext } from "../../core/native/groupContext.js";
import { useHasContext } from "../../core/native/hasContext.js";
export const useStyle = (className, componentProps, state, childrenProps) => {
  "use no memo";
  const [_, rerender] = useReducer(() => ({}), {});
  const groupContext = useGroupContext();
  const hasContext = useHasContext();
  const styleState = UniwindStore.getStyles(className, componentProps, state, groupContext, childrenProps);
  useEffect(() => {
    if (hasContext) {
      return hasContext.registerChild(componentProps);
    }
  }, [hasContext, componentProps]);
  useEffect(() => {
    if (__DEV__ || styleState.dependencies.length > 0) {
      const dispose = UniwindListener.subscribe(rerender, styleState.dependencies);
      return dispose;
    }
  }, [styleState.dependencySum]);
  return styleState.styles;
};
