"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useResolveClassNames = void 0;
var _react = require("react");
var _listener = require("../core/listener");
var _native = require("../core/native");
const useResolveClassNames = className => {
  const [uniwindState, recreate] = (0, _react.useReducer)(() => _native.UniwindStore.getStyles(className), _native.UniwindStore.getStyles(className));
  (0, _react.useEffect)(() => {
    if (className !== "") {
      recreate();
    }
  }, [className]);
  (0, _react.useEffect)(() => {
    if (uniwindState.dependencies.length > 0) {
      const dispose = _listener.UniwindListener.subscribe(recreate, uniwindState.dependencies);
      return dispose;
    }
  }, [uniwindState.dependencies, className]);
  return uniwindState.styles;
};
exports.useResolveClassNames = useResolveClassNames;