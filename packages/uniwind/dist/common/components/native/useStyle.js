"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStyle = void 0;
var _react = require("react");
var _listener = require("../../core/listener");
var _native = require("../../core/native");
var _groupContext = require("../../core/native/groupContext");
var _hasContext = require("../../core/native/hasContext");
const useStyle = (className, componentProps, state, childrenProps) => {
  "use no memo";

  const [_, rerender] = (0, _react.useReducer)(() => ({}), {});
  const groupContext = (0, _groupContext.useGroupContext)();
  const hasContext = (0, _hasContext.useHasContext)();
  const styleState = _native.UniwindStore.getStyles(className, componentProps, state, groupContext, childrenProps);
  (0, _react.useEffect)(() => {
    if (hasContext) {
      return hasContext.registerChild(componentProps);
    }
  }, [hasContext, componentProps]);
  (0, _react.useEffect)(() => {
    if (__DEV__ || styleState.dependencies.length > 0) {
      const dispose = _listener.UniwindListener.subscribe(rerender, styleState.dependencies);
      return dispose;
    }
  }, [styleState.dependencySum]);
  return styleState.styles;
};
exports.useStyle = useStyle;