"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withUniwind = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _react = require("react");
var _web = require("../core/web");
var _withUniwindUtils = require("./withUniwindUtils");
const withUniwind = (Component2, options) => options ? withManualUniwind(Component2, options) : withAutoUniwind(Component2);
exports.withUniwind = withUniwind;
const withAutoUniwind = Component2 => props => {
  const {
    classNames,
    generatedProps
  } = Object.entries(props).reduce((acc, [propName, propValue]) => {
    if ((0, _withUniwindUtils.isColorClassProperty)(propName)) {
      const colorProp = (0, _withUniwindUtils.classToColor)(propName);
      if (props[colorProp] !== void 0) {
        return acc;
      }
      const className = propValue;
      const color = (0, _web.getWebStyles)(className).accentColor;
      acc.generatedProps[colorProp] = color !== void 0 ? (0, _web.formatColor)(color) : void 0;
      acc.classNames += `${className} `;
      return acc;
    }
    if ((0, _withUniwindUtils.isClassProperty)(propName)) {
      const styleProp = (0, _withUniwindUtils.classToStyle)(propName);
      acc.generatedProps[styleProp] ??= [];
      acc.generatedProps[styleProp][0] = {
        $$css: true,
        tailwind: propValue
      };
      return acc;
    }
    if ((0, _withUniwindUtils.isStyleProperty)(propName)) {
      acc.generatedProps[propName] ??= [];
      acc.generatedProps[propName][1] = propValue;
      return acc;
    }
    return acc;
  }, {
    generatedProps: {},
    classNames: ""
  });
  const [, rerender] = (0, _react.useReducer)(() => ({}), {});
  (0, _react.useEffect)(() => {
    const dispose = _web.CSSListener.subscribeToClassName(classNames, rerender);
    return dispose;
  }, [classNames]);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(Component2, {
    ...props,
    ...generatedProps
  });
};
const withManualUniwind = (Component2, options) => props => {
  const {
    generatedProps,
    classNames
  } = Object.entries(options).reduce((acc, [propName, option]) => {
    const className = props[option.fromClassName];
    if (className === void 0) {
      return acc;
    }
    if (option.styleProperty !== void 0) {
      if (props[propName] !== void 0) {
        return acc;
      }
      const value = (0, _web.getWebStyles)(className)[option.styleProperty];
      const transformedValue = value !== void 0 && option.styleProperty.toLowerCase().includes("color") ? (0, _web.formatColor)(value) : value;
      acc.classNames += `${className} `;
      acc.generatedProps[propName] = transformedValue;
      return acc;
    }
    acc.generatedProps[propName] = [{
      $$css: true,
      tailwind: className
    }, props[propName]];
    return acc;
  }, {
    generatedProps: {},
    classNames: ""
  });
  const [, rerender] = (0, _react.useReducer)(() => ({}), {});
  (0, _react.useEffect)(() => {
    const dispose = _web.CSSListener.subscribeToClassName(classNames, rerender);
    return dispose;
  }, [classNames]);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(Component2, {
    ...props,
    ...generatedProps
  });
};