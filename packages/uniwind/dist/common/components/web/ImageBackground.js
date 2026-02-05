"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.ImageBackground = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _hooks = require("../../hooks");
var _utils = require("../utils");
var _rnw = require("./rnw");
const ImageBackground = exports.ImageBackground = (0, _utils.copyComponentProperties)(_reactNative.ImageBackground, props => {
  const tintColor = (0, _hooks.useUniwindAccent)(props.tintColorClassName);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.ImageBackground, {
    ...props,
    style: [(0, _rnw.toRNWClassName)(props.className), props.style],
    imageStyle: [(0, _rnw.toRNWClassName)(props.imageClassName), props.imageStyle],
    tintColor: props.tintColor ?? tintColor
  });
});
module.exports = ImageBackground;