"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCSSVariable = void 0;
var _react = require("react");
var _listener = require("../../core/listener");
var _logger = require("../../core/logger");
var _types = require("../../types");
var _getVariableValue = require("./getVariableValue");
const getValue = name => Array.isArray(name) ? name.map(_getVariableValue.getVariableValue) : (0, _getVariableValue.getVariableValue)(name);
const arrayEquals = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
};
let warned = false;
const logDevError = name => {
  warned = true;
  _logger.Logger.warn(`We couldn't find your variable ${name}. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable`);
};
const useCSSVariable = name => {
  const [value, setValue] = (0, _react.useState)(getValue(name));
  const nameRef = (0, _react.useRef)(name);
  (0, _react.useEffect)(() => {
    if (Array.isArray(name) && Array.isArray(nameRef.current)) {
      if (arrayEquals(name, nameRef.current)) {
        return;
      }
      setValue(getValue(name));
      nameRef.current = name;
      return;
    }
    if (name !== nameRef.current) {
      setValue(getValue(name));
      nameRef.current = name;
    }
  }, [name]);
  (0, _react.useEffect)(() => {
    const updateValue = () => setValue(getValue(nameRef.current));
    const dispose = _listener.UniwindListener.subscribe(updateValue, [_types.StyleDependency.Theme, _types.StyleDependency.Variables]);
    return dispose;
  }, []);
  if (Array.isArray(value)) {
    value.forEach((val, index) => {
      if (val === void 0 && __DEV__ && !warned) {
        logDevError(name[index] ?? "");
      }
    });
  }
  if (value === void 0 && __DEV__ && !warned) {
    logDevError(name);
  }
  return value;
};
exports.useCSSVariable = useCSSVariable;