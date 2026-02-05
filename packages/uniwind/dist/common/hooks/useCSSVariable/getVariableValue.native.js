"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVariableValue = void 0;
var _native = require("../../core/native");
const getVariableValue = name => _native.UniwindStore.vars[name];
exports.getVariableValue = getVariableValue;