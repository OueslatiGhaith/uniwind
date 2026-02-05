"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.TouchableHighlight = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _react = require("react");
var _reactNative = require("react-native");
var _utils = require("../utils");
var _useStyle = require("./useStyle");
const TouchableHighlight = exports.TouchableHighlight = (0, _utils.copyComponentProperties)(_reactNative.TouchableHighlight, props => {
  const [isPressed, setIsPressed] = (0, _react.useState)(false);
  const state = {
    isDisabled: Boolean(props.disabled),
    isPressed
  };
  const style = (0, _useStyle.useStyle)(props.className, props, state);
  const underlayColor = (0, _useStyle.useStyle)(props.underlayColorClassName, props, state).accentColor;
  return /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.TouchableHighlight, {
    ...props,
    style: [style, props.style],
    underlayColor: props.underlayColor ?? underlayColor,
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
module.exports = TouchableHighlight;