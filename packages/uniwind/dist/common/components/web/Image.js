"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.Image = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _hooks = require("../../hooks");
var _utils = require("../utils");
var _rnw = require("./rnw");
const Image = exports.Image = (0, _utils.copyComponentProperties)(_reactNative.Image, props => {
  const tintColor = (0, _hooks.useUniwindAccent)(props.tintColorClassName);
  const styles = (0, _hooks.useResolveClassNames)(props.className ?? "");
  const isUsingWidth = styles.width !== void 0;
  const isUsingHeight = styles.height !== void 0;
  const styleReset = {
    width: isUsingWidth ? "" : void 0,
    height: isUsingHeight ? "" : void 0
  };
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.Image, {
    ...props,
    style: [(0, _rnw.toRNWClassName)(props.className), styleReset, props.style],
    tintColor: props.tintColor ?? tintColor
  });
});
module.exports = Image;