"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _useCSSVariable = require("./useCSSVariable");
Object.keys(_useCSSVariable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useCSSVariable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useCSSVariable[key];
    }
  });
});