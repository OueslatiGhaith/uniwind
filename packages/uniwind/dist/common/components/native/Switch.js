"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.Switch = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _reactNative = require("react-native");
var _utils = require("../utils");
var _useStyle = require("./useStyle");
const Switch = exports.Switch = (0, _utils.copyComponentProperties)(_reactNative.Switch, props => {
  const state = {
    isDisabled: Boolean(props.disabled)
  };
  const style = (0, _useStyle.useStyle)(props.className, props, state);
  const trackColorOn = (0, _useStyle.useStyle)(props.trackColorOnClassName, props, state).accentColor;
  const trackColorOff = (0, _useStyle.useStyle)(props.trackColorOffClassName, props, state).accentColor;
  const thumbColor = (0, _useStyle.useStyle)(props.thumbColorClassName, props, state).accentColor;
  const ios_backgroundColor = (0, _useStyle.useStyle)(props.ios_backgroundColorClassName, props, state).accentColor;
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.Switch, {
    ...props,
    style: [style, props.style],
    thumbColor: props.thumbColor ?? thumbColor,
    trackColor: {
      true: props.trackColor?.true ?? trackColorOn,
      false: props.trackColor?.false ?? trackColorOff
    },
    ios_backgroundColor: props.ios_backgroundColor ?? ios_backgroundColor
  });
});
module.exports = Switch;