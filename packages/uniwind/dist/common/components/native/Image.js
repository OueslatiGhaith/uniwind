"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.Image = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _utils = require("../utils");
var _useStyle = require("./useStyle");
const Image = exports.Image = (0, _utils.copyComponentProperties)(_reactNative.Image, props => {
  const style = (0, _useStyle.useStyle)(props.className, props);
  const tintColor = (0, _useStyle.useStyle)(props.tintColorClassName, props).accentColor;
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.Image, {
    ...props,
    style: [style, props.style],
    tintColor: props.tintColor ?? tintColor
  });
});
module.exports = Image;