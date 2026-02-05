"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.ActivityIndicator = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _hooks = require("../../hooks");
var _utils = require("../utils");
var _rnw = require("./rnw");
const ActivityIndicator = exports.ActivityIndicator = (0, _utils.copyComponentProperties)(_reactNative.ActivityIndicator, props => {
  const color = (0, _hooks.useUniwindAccent)(props.colorClassName);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
    ...props,
    style: [(0, _rnw.toRNWClassName)(props.className), props.style],
    color: props.color ?? color
  });
});
module.exports = ActivityIndicator;