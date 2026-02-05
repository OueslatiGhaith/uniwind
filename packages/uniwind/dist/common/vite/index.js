"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _vite = require("./vite");
Object.keys(_vite).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _vite[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _vite[key];
    }
  });
});