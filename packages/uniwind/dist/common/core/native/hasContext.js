"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHasContext = exports.HasContext = void 0;
var _react = require("react");
const HasContext = exports.HasContext = (0, _react.createContext)(null);
const useHasContext = () => (0, _react.useContext)(HasContext);
exports.useHasContext = useHasContext;