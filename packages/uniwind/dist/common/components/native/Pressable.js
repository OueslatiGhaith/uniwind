"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.Pressable = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _react = require("react");
var _reactNative = require("react-native");
var _native = require("../../core/native");
var _groupContext = require("../../core/native/groupContext");
var _hasContext = require("../../core/native/hasContext");
var _utils = require("../utils");
var _useStyle = require("./useStyle");
const Pressable = exports.Pressable = (0, _utils.copyComponentProperties)(_reactNative.Pressable, props => {
  const [isPressed, setIsPressed] = (0, _react.useState)(false);
  const [childrenPropsMap, setChildrenPropsMap] = (0, _react.useState)(/* @__PURE__ */new Map());
  const parentGroupContext = (0, _groupContext.useGroupContext)();
  const registerChild = (0, _react.useCallback)(childProps => {
    const id = {};
    setChildrenPropsMap(prev => new Map(prev).set(id, childProps));
    return () => setChildrenPropsMap(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);
  const hasContextValue = (0, _react.useMemo)(() => ({
    registerChild
  }), [registerChild]);
  const childrenProps = (0, _react.useMemo)(() => Array.from(childrenPropsMap.values()), [childrenPropsMap]);
  const style = (0, _useStyle.useStyle)(props.className, props, {
    isDisabled: Boolean(props.disabled),
    isPressed
  }, childrenProps);
  const groupContext = (0, _react.useMemo)(() => {
    const className = props.className;
    if (!className || !className.includes("group") && !className.includes("group/")) {
      return parentGroupContext;
    }
    const nextContext = {
      ...parentGroupContext
    };
    const dataAttributes = Object.fromEntries(Object.entries(props).filter(([key]) => key.startsWith("data-")));
    className.split(" ").forEach(cls => {
      if (cls === "group" || cls.startsWith("group/")) {
        nextContext[cls] = [...(parentGroupContext[cls] ?? []), {
          dataAttributes,
          isPressed,
          isFocused: false,
          isDisabled: Boolean(props.disabled),
          childrenProps
        }];
      }
    });
    return nextContext;
  }, [props.className, props, parentGroupContext, isPressed, childrenProps]);
  let content = /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    ...props,
    onPressIn: e => {
      setIsPressed(true);
      props.onPressIn?.(e);
    },
    onPressOut: e => {
      setIsPressed(false);
      props.onPressOut?.(e);
    },
    style: state => {
      const currentStyle = isPressed ? _native.UniwindStore.getStyles(props.className, props, {
        isDisabled: Boolean(props.disabled),
        isPressed: state.pressed || isPressed
      }, parentGroupContext, childrenProps).styles : style;
      return [currentStyle, typeof props.style === "function" ? props.style(state) : props.style];
    }
  });
  const isGroup = props.className?.split(" ").some(cls => cls === "group" || cls.startsWith("group/"));
  const useHas = props.className?.includes("has-");
  if (isGroup || useHas) {
    content = /* @__PURE__ */(0, _jsxRuntime.jsx)(_hasContext.HasContext.Provider, {
      value: hasContextValue,
      children: content
    });
  }
  if (groupContext !== parentGroupContext) {
    content = /* @__PURE__ */(0, _jsxRuntime.jsx)(_groupContext.GroupContext.Provider, {
      value: groupContext,
      children: content
    });
  }
  return content;
});
module.exports = Pressable;