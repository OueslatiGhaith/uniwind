"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useResolveClassNames = void 0;
var _react = require("react");
var _web = require("../core/web");
const emptyState = {};
const useResolveClassNames = className => {
  const [styles, recreate] = (0, _react.useReducer)(() => className !== "" ? (0, _web.getWebStyles)(className) : emptyState, className !== "" ? (0, _web.getWebStyles)(className) : emptyState);
  (0, _react.useEffect)(() => {
    if (className === "") {
      return;
    }
    recreate();
    const dispose = _web.CSSListener.subscribeToClassName(className, recreate);
    return dispose;
  }, [className]);
  return styles;
};
exports.useResolveClassNames = useResolveClassNames;