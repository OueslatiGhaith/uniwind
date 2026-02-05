"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UniwindConfigBuilder = exports.Uniwind = void 0;
var _reactNative = require("react-native");
var _types = require("../../types");
var _listener = require("../listener");
const SYSTEM_THEME = "system";
const RN_VERSION = _reactNative.Platform.constants?.reactNativeVersion?.minor ?? 0;
const UNSPECIFIED_THEME = RN_VERSION >= 82 ? "unspecified" : void 0;
class UniwindConfigBuilder {
  themes = ["light", "dark"];
  #hasAdaptiveThemes = true;
  #currentTheme = this.colorScheme;
  constructor() {
    _reactNative.Appearance.addChangeListener(event => {
      const colorScheme = event.colorScheme === "unspecified" ? _types.ColorScheme.Light : event.colorScheme ?? _types.ColorScheme.Light;
      const prevTheme = this.#currentTheme;
      if (this.#hasAdaptiveThemes && prevTheme !== colorScheme) {
        this.#currentTheme = colorScheme;
        this.onThemeChange();
        _listener.UniwindListener.notify([_types.StyleDependency.Theme]);
      }
    });
  }
  get hasAdaptiveThemes() {
    return this.#hasAdaptiveThemes;
  }
  get currentTheme() {
    return this.#currentTheme;
  }
  get colorScheme() {
    const colorScheme = _reactNative.Appearance.getColorScheme();
    if (colorScheme === "unspecified") {
      return _types.ColorScheme.Light;
    }
    return colorScheme ?? _types.ColorScheme.Light;
  }
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  setTheme(theme) {
    const prevTheme = this.#currentTheme;
    const prevHasAdaptiveThemes = this.#hasAdaptiveThemes;
    const isAdaptiveTheme = ["light", "dark"].includes(theme);
    try {
      if (theme === SYSTEM_THEME) {
        this.#hasAdaptiveThemes = true;
        this.#currentTheme = this.colorScheme;
        if (_reactNative.Platform.OS !== "web") {
          _reactNative.Appearance.setColorScheme(UNSPECIFIED_THEME);
        }
        return;
      }
      if (!this.themes.includes(theme)) {
        throw new Error(`Uniwind: You're trying to setTheme to '${theme}', but it was not registered.`);
      }
      this.#hasAdaptiveThemes = false;
      this.#currentTheme = theme;
      if (_reactNative.Platform.OS !== "web") {
        _reactNative.Appearance.setColorScheme(
        // @ts-expect-error RN >0.82 - breaking change
        isAdaptiveTheme ? this.#currentTheme : UNSPECIFIED_THEME);
      }
    } finally {
      if (prevTheme !== this.#currentTheme) {
        this.onThemeChange();
        _listener.UniwindListener.notify([_types.StyleDependency.Theme]);
      }
      if (prevHasAdaptiveThemes !== this.#hasAdaptiveThemes) {
        _listener.UniwindListener.notify([_types.StyleDependency.AdaptiveThemes]);
      }
    }
  }
  updateCSSVariables(theme, variables) {
    theme;
    variables;
  }
  updateInsets(insets) {
    insets;
  }
  __reinit(_, themes) {
    this.themes = themes;
  }
  onThemeChange() {}
}
exports.UniwindConfigBuilder = UniwindConfigBuilder;
const Uniwind = exports.Uniwind = new UniwindConfigBuilder();