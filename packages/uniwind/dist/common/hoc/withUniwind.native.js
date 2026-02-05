"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withUniwind = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _react = require("react");
var _listener = require("../core/listener");
var _native = require("../core/native");
var _withUniwindUtils = require("./withUniwindUtils");
const withUniwind = (Component2, options) => options ? withManualUniwind(Component2, options) : withAutoUniwind(Component2);
exports.withUniwind = withUniwind;
const withAutoUniwind = Component2 => props => {
  const {
    dependencies,
    generatedProps
  } = Object.entries(props).reduce((acc, [propName, propValue]) => {
    if ((0, _withUniwindUtils.isColorClassProperty)(propName)) {
      const colorProp = (0, _withUniwindUtils.classToColor)(propName);
      if (props[colorProp] !== void 0) {
        return acc;
      }
      const {
        styles,
        dependencies: dependencies2
      } = _native.UniwindStore.getStyles(propValue);
      acc.dependencies.push(...dependencies2);
      acc.generatedProps[colorProp] = styles.accentColor;
      return acc;
    }
    if ((0, _withUniwindUtils.isClassProperty)(propName)) {
      const styleProp = (0, _withUniwindUtils.classToStyle)(propName);
      const {
        styles,
        dependencies: dependencies2
      } = _native.UniwindStore.getStyles(propValue);
      acc.dependencies.push(...dependencies2);
      acc.generatedProps[styleProp] ??= [];
      acc.generatedProps[styleProp][0] = styles;
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
    dependencies: []
  });
  const deps = Array.from(new Set(dependencies));
  const [, rerender] = (0, _react.useReducer)(() => ({}), {});
  (0, _react.useEffect)(() => {
    const dispose = _listener.UniwindListener.subscribe(rerender, deps);
    return dispose;
  }, [deps]);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(Component2, {
    ...props,
    ...generatedProps
  });
};
const withManualUniwind = (Component2, options) => props => {
  const {
    generatedProps,
    dependencies
  } = Object.entries(options).reduce((acc, [propName, option]) => {
    const className = props[option.fromClassName];
    if (className === void 0) {
      return acc;
    }
    if (option.styleProperty !== void 0) {
      if (props[propName] !== void 0) {
        return acc;
      }
      const {
        styles: styles2,
        dependencies: dependencies3
      } = _native.UniwindStore.getStyles(className);
      acc.generatedProps[propName] = styles2[option.styleProperty];
      acc.dependencies.push(...dependencies3);
      return acc;
    }
    const {
      styles,
      dependencies: dependencies2
    } = _native.UniwindStore.getStyles(className);
    acc.generatedProps[propName] = styles;
    acc.dependencies.push(...dependencies2);
    return acc;
  }, {
    generatedProps: {},
    dependencies: []
  });
  const deps = Array.from(new Set(dependencies));
  const [, rerender] = (0, _react.useReducer)(() => ({}), {});
  (0, _react.useEffect)(() => {
    const dispose = _listener.UniwindListener.subscribe(rerender, deps);
    return dispose;
  }, [deps]);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(Component2, {
    ...props,
    ...generatedProps
  });
};