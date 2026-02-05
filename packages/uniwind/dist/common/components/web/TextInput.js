"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.TextInput = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _hooks = require("../../hooks");
var _utils = require("../utils");
var _rnw = require("./rnw");
const TextInput = exports.TextInput = (0, _utils.copyComponentProperties)(_reactNative.TextInput, props => {
  const placeholderTextColor = (0, _hooks.useUniwindAccent)(props.placeholderTextColorClassName);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.TextInput, {
    ...props,
    style: [(0, _rnw.toRNWClassName)(props.className), props.style],
    placeholderTextColor: props.placeholderTextColor ?? placeholderTextColor
  });
});
module.exports = TextInput;