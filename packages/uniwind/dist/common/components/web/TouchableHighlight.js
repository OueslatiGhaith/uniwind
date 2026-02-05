"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.TouchableHighlight = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _hooks = require("../../hooks");
var _utils = require("../utils");
var _rnw = require("./rnw");
const TouchableHighlight = exports.TouchableHighlight = (0, _utils.copyComponentProperties)(_reactNative.TouchableHighlight, props => {
  const underlayColor = (0, _hooks.useUniwindAccent)(props.underlayColorClassName);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.TouchableHighlight, {
    ...props,
    style: [(0, _rnw.toRNWClassName)(props.className), props.style],
    underlayColor: props.underlayColor ?? underlayColor
  });
});
module.exports = TouchableHighlight;