"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Uniwind = void 0;
var _types = require("../../types");
var _listener = require("../listener");
var _logger = require("../logger");
var _config = require("./config.common");
class UniwindConfigBuilder extends _config.UniwindConfigBuilder {
  runtimeCSSVariables = /* @__PURE__ */new Map();
  constructor() {
    super();
  }
  updateCSSVariables(theme, variables) {
    Object.entries(variables).forEach(([varName, varValue]) => {
      if (!varName.startsWith("--") && __DEV__) {
        _logger.Logger.error(`CSS variable name must start with "--", instead got: ${varName}`);
        return;
      }
      const runtimeCSSVariables = this.runtimeCSSVariables.get(theme) ?? {};
      runtimeCSSVariables[varName] = varValue;
      this.runtimeCSSVariables.set(theme, runtimeCSSVariables);
      if (theme === this.currentTheme) {
        this.applyCSSVariable(varName, varValue);
      }
    });
    if (theme === this.currentTheme) {
      _listener.UniwindListener.notify([_types.StyleDependency.Variables]);
    }
  }
  onThemeChange() {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.removeAttribute("style");
    const runtimeCSSVariables = this.runtimeCSSVariables.get(this.currentTheme);
    if (!runtimeCSSVariables) {
      return;
    }
    Object.entries(runtimeCSSVariables).forEach(([varName, varValue]) => {
      this.applyCSSVariable(varName, varValue);
    });
  }
  applyCSSVariable(varName, varValue) {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.style.setProperty(varName, typeof varValue === "number" ? `${varValue}px` : varValue);
  }
}
const Uniwind = exports.Uniwind = new UniwindConfigBuilder();