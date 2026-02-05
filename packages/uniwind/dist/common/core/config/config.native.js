"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Uniwind = void 0;
var _culori = require("culori");
var _types = require("../../types");
var _listener = require("../listener");
var _logger = require("../logger");
var _native = require("../native");
var _config = require("./config.common");
class UniwindConfigBuilder extends _config.UniwindConfigBuilder {
  constructor() {
    super();
  }
  updateCSSVariables(theme, variables) {
    Object.entries(variables).forEach(([varName, varValue]) => {
      if (!varName.startsWith("--") && __DEV__) {
        _logger.Logger.error(`CSS variable name must start with "--", instead got: ${varName}`);
        return;
      }
      const getValue = () => {
        if (typeof varValue === "number") {
          return varValue;
        }
        const parsedColor = (0, _culori.parse)(varValue);
        if (parsedColor) {
          return parsedColor.alpha === void 0 || parsedColor.alpha === 1 ? (0, _culori.formatHex)(parsedColor) : (0, _culori.formatHex8)(parsedColor);
        }
        return varValue;
      };
      const value = getValue();
      const runtimeThemeVariables = _native.UniwindStore.runtimeThemeVariables.get(theme) ?? {};
      if (theme === this.currentTheme) {
        Object.defineProperty(_native.UniwindStore.vars, varName, {
          configurable: true,
          enumerable: true,
          get: () => value
        });
      }
      Object.defineProperty(runtimeThemeVariables, varName, {
        configurable: true,
        enumerable: true,
        get: () => value
      });
      _native.UniwindStore.runtimeThemeVariables.set(theme, runtimeThemeVariables);
    });
    if (theme === this.currentTheme) {
      _listener.UniwindListener.notify([_types.StyleDependency.Variables]);
    }
  }
  updateInsets(insets) {
    _native.UniwindStore.runtime.insets.bottom = insets.bottom ?? 0;
    _native.UniwindStore.runtime.insets.top = insets.top ?? 0;
    _native.UniwindStore.runtime.insets.left = insets.left ?? 0;
    _native.UniwindStore.runtime.insets.right = insets.right ?? 0;
    _listener.UniwindListener.notify([_types.StyleDependency.Insets]);
  }
  __reinit(generateStyleSheetCallback, themes) {
    super.__reinit(generateStyleSheetCallback, themes);
    _native.UniwindStore.reinit(generateStyleSheetCallback);
  }
  onThemeChange() {
    _native.UniwindStore.runtime.currentThemeName = this.currentTheme;
    _native.UniwindStore.reinit();
  }
}
const Uniwind = exports.Uniwind = new UniwindConfigBuilder();