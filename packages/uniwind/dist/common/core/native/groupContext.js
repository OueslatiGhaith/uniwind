"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGroupContext = exports.GroupContext = void 0;
var _react = require("react");
const GroupContext = exports.GroupContext = (0, _react.createContext)({});
const useGroupContext = () => (0, _react.useContext)(GroupContext);
exports.useGroupContext = useGroupContext;