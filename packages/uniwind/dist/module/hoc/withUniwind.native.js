import { jsx } from "react/jsx-runtime";
import { useEffect, useReducer } from "react";
import { UniwindListener } from "../core/listener.js";
import { UniwindStore } from "../core/native/index.js";
import { classToColor, classToStyle, isClassProperty, isColorClassProperty, isStyleProperty } from "./withUniwindUtils.js";
export const withUniwind = (Component2, options) => options ? withManualUniwind(Component2, options) : withAutoUniwind(Component2);
const withAutoUniwind = (Component2) => (props) => {
  const { dependencies, generatedProps } = Object.entries(props).reduce((acc, [propName, propValue]) => {
    if (isColorClassProperty(propName)) {
      const colorProp = classToColor(propName);
      if (props[colorProp] !== void 0) {
        return acc;
      }
      const { styles, dependencies: dependencies2 } = UniwindStore.getStyles(propValue);
      acc.dependencies.push(...dependencies2);
      acc.generatedProps[colorProp] = styles.accentColor;
      return acc;
    }
    if (isClassProperty(propName)) {
      const styleProp = classToStyle(propName);
      const { styles, dependencies: dependencies2 } = UniwindStore.getStyles(propValue);
      acc.dependencies.push(...dependencies2);
      acc.generatedProps[styleProp] ??= [];
      acc.generatedProps[styleProp][0] = styles;
      return acc;
    }
    if (isStyleProperty(propName)) {
      acc.generatedProps[propName] ??= [];
      acc.generatedProps[propName][1] = propValue;
      return acc;
    }
    return acc;
  }, { generatedProps: {}, dependencies: [] });
  const deps = Array.from(new Set(dependencies));
  const [, rerender] = useReducer(() => ({}), {});
  useEffect(() => {
    const dispose = UniwindListener.subscribe(rerender, deps);
    return dispose;
  }, [deps]);
  return /* @__PURE__ */ jsx(
    Component2,
    {
      ...props,
      ...generatedProps
    }
  );
};
const withManualUniwind = (Component2, options) => (props) => {
  const { generatedProps, dependencies } = Object.entries(options).reduce((acc, [propName, option]) => {
    const className = props[option.fromClassName];
    if (className === void 0) {
      return acc;
    }
    if (option.styleProperty !== void 0) {
      if (props[propName] !== void 0) {
        return acc;
      }
      const { styles: styles2, dependencies: dependencies3 } = UniwindStore.getStyles(className);
      acc.generatedProps[propName] = styles2[option.styleProperty];
      acc.dependencies.push(...dependencies3);
      return acc;
    }
    const { styles, dependencies: dependencies2 } = UniwindStore.getStyles(className);
    acc.generatedProps[propName] = styles;
    acc.dependencies.push(...dependencies2);
    return acc;
  }, { generatedProps: {}, dependencies: [] });
  const deps = Array.from(new Set(dependencies));
  const [, rerender] = useReducer(() => ({}), {});
  useEffect(() => {
    const dispose = UniwindListener.subscribe(rerender, deps);
    return dispose;
  }, [deps]);
  return /* @__PURE__ */ jsx(
    Component2,
    {
      ...props,
      ...generatedProps
    }
  );
};
