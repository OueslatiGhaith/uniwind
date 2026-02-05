import { Appearance, Platform } from "react-native";
import { ColorScheme, StyleDependency } from "../../types.js";
import { UniwindListener } from "../listener.js";
const SYSTEM_THEME = "system";
const RN_VERSION = Platform.constants?.reactNativeVersion?.minor ?? 0;
const UNSPECIFIED_THEME = RN_VERSION >= 82 ? "unspecified" : void 0;
export class UniwindConfigBuilder {
  themes = ["light", "dark"];
  #hasAdaptiveThemes = true;
  #currentTheme = this.colorScheme;
  constructor() {
    Appearance.addChangeListener((event) => {
      const colorScheme = event.colorScheme === "unspecified" ? ColorScheme.Light : event.colorScheme ?? ColorScheme.Light;
      const prevTheme = this.#currentTheme;
      if (this.#hasAdaptiveThemes && prevTheme !== colorScheme) {
        this.#currentTheme = colorScheme;
        this.onThemeChange();
        UniwindListener.notify([StyleDependency.Theme]);
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
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme === "unspecified") {
      return ColorScheme.Light;
    }
    return colorScheme ?? ColorScheme.Light;
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
        if (Platform.OS !== "web") {
          Appearance.setColorScheme(UNSPECIFIED_THEME);
        }
        return;
      }
      if (!this.themes.includes(theme)) {
        throw new Error(`Uniwind: You're trying to setTheme to '${theme}', but it was not registered.`);
      }
      this.#hasAdaptiveThemes = false;
      this.#currentTheme = theme;
      if (Platform.OS !== "web") {
        Appearance.setColorScheme(
          // @ts-expect-error RN >0.82 - breaking change
          isAdaptiveTheme ? this.#currentTheme : UNSPECIFIED_THEME
        );
      }
    } finally {
      if (prevTheme !== this.#currentTheme) {
        this.onThemeChange();
        UniwindListener.notify([StyleDependency.Theme]);
      }
      if (prevHasAdaptiveThemes !== this.#hasAdaptiveThemes) {
        UniwindListener.notify([StyleDependency.AdaptiveThemes]);
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
  onThemeChange() {
  }
}
export const Uniwind = new UniwindConfigBuilder();
