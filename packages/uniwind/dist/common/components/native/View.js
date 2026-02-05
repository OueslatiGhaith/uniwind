"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = exports.View = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _react = require("react");
var _reactNative = require("react-native");
var _groupContext = require("../../core/native/groupContext");
var _hasContext = require("../../core/native/hasContext");
var _utils = require("../utils");
var _useStyle = require("./useStyle");
const View = exports.View = (0, _utils.copyComponentProperties)(_reactNative.View, props => {
  const [childrenPropsMap, setChildrenPropsMap] = (0, _react.useState)(/* @__PURE__ */new Map());
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
  const style = (0, _useStyle.useStyle)(props.className, props, void 0, childrenProps);
  const parentGroupContext = (0, _groupContext.useGroupContext)();
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
          childrenProps
        }];
      }
    });
    return nextContext;
  }, [props.className, props, parentGroupContext, childrenProps]);
  let content = /* @__PURE__ */(0, _jsxRuntime.jsx)(_reactNative.View, {
    ...props,
    style: [style, props.style]
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
module.exports = View;