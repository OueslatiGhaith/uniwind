"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.Switch = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _hooks = require("../../hooks");
var _utils = require("../utils");
var _rnw = require("./rnw");
const Switch = exports.Switch = (0, _utils.copyComponentProperties)(_reactNative.Switch, props => {
  const trackColorOn = (0, _hooks.useUniwindAccent)(props.trackColorOnClassName);
  const trackColorOff = (0, _hooks.useUniwindAccent)(props.trackColorOffClassName);
  const thumbColor = (0, _hooks.useUniwindAccent)(props.thumbColorClassName);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.Switch, {
    ...props,
    style: [(0, _rnw.toRNWClassName)(props.className), props.style],
    thumbColor: props.thumbColor ?? thumbColor,
    trackColor: {
      true: props.trackColor?.true ?? trackColorOn,
      false: props.trackColor?.false ?? trackColorOff
    }
  });
});
module.exports = Switch;