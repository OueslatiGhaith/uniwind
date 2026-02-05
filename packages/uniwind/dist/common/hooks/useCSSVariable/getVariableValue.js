"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVariableValue = void 0;
var _web = require("../../core/web");
const documentStyles = typeof document !== "undefined" ? window.getComputedStyle(document.documentElement) : null;
const getVariableValue = name => {
  if (!documentStyles) {
    return void 0;
  }
  const value = documentStyles.getPropertyValue(name).trim();
  if (value === "") {
    return void 0;
  }
  return (0, _web.parseCSSValue)(value);
};
exports.getVariableValue = getVariableValue;