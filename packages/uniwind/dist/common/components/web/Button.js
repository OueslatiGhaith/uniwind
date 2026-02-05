"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.Button = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _hooks = require("../../hooks");
var _utils = require("../utils");
const Button = exports.Button = (0, _utils.copyComponentProperties)(_reactNative.Button, props => {
  const color = (0, _hooks.useUniwindAccent)(props.colorClassName);
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.Button, {
    ...props,
    color: props.color ?? color
  });
});
module.exports = Button;