"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.TextInput = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _react = require("react");
var _reactNative = require("react-native");
var _utils = require("../utils");
var _useStyle = require("./useStyle");
const TextInput = exports.TextInput = (0, _utils.copyComponentProperties)(_reactNative.TextInput, props => {
  const [isFocused, setIsFocused] = (0, _react.useState)(false);
  const [isPressed, setIsPressed] = (0, _react.useState)(false);
  const state = {
    isDisabled: props.editable === false,
    isFocused,
    isPressed
  };
  const style = (0, _useStyle.useStyle)(props.className, props, state);
  const cursorColor = (0, _useStyle.useStyle)(props.cursorColorClassName, props, state).accentColor;
  const selectionColor = (0, _useStyle.useStyle)(props.selectionColorClassName, props, state).accentColor;
  const placeholderTextColor = (0, _useStyle.useStyle)(props.placeholderTextColorClassName, props, state).accentColor;
  const selectionHandleColor = (0, _useStyle.useStyle)(props.selectionHandleColorClassName, props, state).accentColor;
  const underlineColorAndroid = (0, _useStyle.useStyle)(props.underlineColorAndroidClassName, props, state).accentColor;
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.TextInput, {
    ...props,
    style: [style, props.style],
    cursorColor: props.cursorColor ?? cursorColor,
    selectionColor: props.selectionColor ?? selectionColor,
    placeholderTextColor: props.placeholderTextColor ?? placeholderTextColor,
    selectionHandleColor: props.selectionHandleColor ?? selectionHandleColor,
    underlineColorAndroid: props.underlineColorAndroid ?? underlineColorAndroid,
    onFocus: event => {
      setIsFocused(true);
      props.onFocus?.(event);
    },
    onBlur: event => {
      setIsFocused(false);
      props.onBlur?.(event);
    },
    onPressIn: event => {
      setIsPressed(true);
      props.onPressIn?.(event);
    },
    onPressOut: event => {
      setIsPressed(false);
      props.onPressOut?.(event);
    }
  });
});
module.exports = TextInput;