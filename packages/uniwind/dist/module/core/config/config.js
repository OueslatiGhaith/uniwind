import { StyleDependency } from "../../types.js";
import { UniwindListener } from "../listener.js";
import { Logger } from "../logger.js";
import { UniwindConfigBuilder as UniwindConfigBuilderBase } from "./config.common.js";
class UniwindConfigBuilder extends UniwindConfigBuilderBase {
  runtimeCSSVariables = /* @__PURE__ */ new Map();
  constructor() {
    super();
  }
  updateCSSVariables(theme, variables) {
    Object.entries(variables).forEach(([varName, varValue]) => {
      if (!varName.startsWith("--") && __DEV__) {
        Logger.error(`CSS variable name must start with "--", instead got: ${varName}`);
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
      UniwindListener.notify([StyleDependency.Variables]);
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
    document.documentElement.style.setProperty(
      varName,
      typeof varValue === "number" ? `${varValue}px` : varValue
    );
  }
}
export const Uniwind = new UniwindConfigBuilder();
