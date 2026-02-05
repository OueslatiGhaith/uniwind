"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toRNWClassName = void 0;
var _core = require("../../core");
var _listener = require("../../core/listener");
var _types = require("../../types");
require("./metro-injected");
const addClassNameToRoot = () => {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  _core.Uniwind.themes.forEach(theme => root.classList.remove(theme));
  root.classList.add(_core.Uniwind.currentTheme);
};
_listener.UniwindListener.subscribe(() => {
  addClassNameToRoot();
}, [_types.StyleDependency.Theme]);
addClassNameToRoot();
const toRNWClassName = className => className !== void 0 ? {
  $$css: true,
  tailwind: className
} : {};
exports.toRNWClassName = toRNWClassName;