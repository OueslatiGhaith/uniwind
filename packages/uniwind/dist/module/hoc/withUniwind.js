import { jsx } from "react/jsx-runtime";
import { useEffect, useReducer } from "react";
import { CSSListener, formatColor, getWebStyles } from "../core/web/index.js";
import { classToColor, classToStyle, isClassProperty, isColorClassProperty, isStyleProperty } from "./withUniwindUtils.js";
export const withUniwind = (Component2, options) => options ? withManualUniwind(Component2, options) : withAutoUniwind(Component2);
const withAutoUniwind = (Component2) => (props) => {
  const { classNames, generatedProps } = Object.entries(props).reduce((acc, [propName, propValue]) => {
    if (isColorClassProperty(propName)) {
      const colorProp = classToColor(propName);
      if (props[colorProp] !== void 0) {
        return acc;
      }
      const className = propValue;
      const color = getWebStyles(className).accentColor;
      acc.generatedProps[colorProp] = color !== void 0 ? formatColor(color) : void 0;
      acc.classNames += `${className} `;
      return acc;
    }
    if (isClassProperty(propName)) {
      const styleProp = classToStyle(propName);
      acc.generatedProps[styleProp] ??= [];
      acc.generatedProps[styleProp][0] = { $$css: true, tailwind: propValue };
      return acc;
    }
    if (isStyleProperty(propName)) {
      acc.generatedProps[propName] ??= [];
      acc.generatedProps[propName][1] = propValue;
      return acc;
    }
    return acc;
  }, { generatedProps: {}, classNames: "" });
  const [, rerender] = useReducer(() => ({}), {});
  useEffect(() => {
    const dispose = CSSListener.subscribeToClassName(classNames, rerender);
    return dispose;
  }, [classNames]);
  return /* @__PURE__ */ jsx(
    Component2,
    {
      ...props,
      ...generatedProps
    }
  );
};
const withManualUniwind = (Component2, options) => (props) => {
  const { generatedProps, classNames } = Object.entries(options).reduce((acc, [propName, option]) => {
    const className = props[option.fromClassName];
    if (className === void 0) {
      return acc;
    }
    if (option.styleProperty !== void 0) {
      if (props[propName] !== void 0) {
        return acc;
      }
      const value = getWebStyles(className)[option.styleProperty];
      const transformedValue = value !== void 0 && option.styleProperty.toLowerCase().includes("color") ? formatColor(value) : value;
      acc.classNames += `${className} `;
      acc.generatedProps[propName] = transformedValue;
      return acc;
    }
    acc.generatedProps[propName] = [{ $$css: true, tailwind: className }, props[propName]];
    return acc;
  }, { generatedProps: {}, classNames: "" });
  const [, rerender] = useReducer(() => ({}), {});
  useEffect(() => {
    const dispose = CSSListener.subscribeToClassName(classNames, rerender);
    return dispose;
  }, [classNames]);
  return /* @__PURE__ */ jsx(
    Component2,
    {
      ...props,
      ...generatedProps
    }
  );
};
