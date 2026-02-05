"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.Text = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _utils = require("../utils");
var _rnw = require("./rnw");
const Text = exports.Text = (0, _utils.copyComponentProperties)(_reactNative.Text, props => {
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.Text, {
    ...props,
    style: [(0, _rnw.toRNWClassName)(props.className), props.style]
  });
});
module.exports = Text;