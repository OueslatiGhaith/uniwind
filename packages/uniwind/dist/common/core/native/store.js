"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UniwindStore = void 0;
var _reactNative = require("react-native");
var _types = require("../../types");
var _listener = require("../listener");
var _nativeUtils = require("./native-utils");
var _parsers = require("./parsers");
var _runtime = require("./runtime");
const emptyState = {
  styles: {},
  dependencies: [],
  dependencySum: 0,
  hasDataAttributes: false,
  hasGroup: false,
  hasHas: false
};
class UniwindStoreBuilder {
  runtime = _runtime.UniwindRuntime;
  vars = {};
  runtimeThemeVariables = /* @__PURE__ */new Map();
  stylesheet = {};
  cache = /* @__PURE__ */new Map();
  generateStyleSheetCallbackResult = null;
  getStyles(className, componentProps, state, groupContext, childrenProps) {
    if (className === void 0 || className === "") {
      return emptyState;
    }
    const cacheKey = `${className}${state?.isDisabled ?? false}${state?.isFocused ?? false}${state?.isPressed ?? false}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const result = this.resolveStyles(className, componentProps, state, groupContext, childrenProps);
    if (!result.hasDataAttributes && !result.hasGroup && !result.hasHas) {
      this.cache.set(cacheKey, result);
      _listener.UniwindListener.subscribe(() => this.cache.delete(cacheKey), result.dependencies, {
        once: true
      });
    }
    return result;
  }
  reinit = generateStyleSheetCallback => {
    const config = generateStyleSheetCallback?.(this.runtime) ?? this.generateStyleSheetCallbackResult;
    if (!config) {
      return;
    }
    const {
      scopedVars,
      stylesheet,
      vars
    } = config;
    this.generateStyleSheetCallbackResult = config;
    this.stylesheet = stylesheet;
    this.vars = vars;
    const themeVars = scopedVars[`__uniwind-theme-${this.runtime.currentThemeName}`];
    const platformVars = scopedVars[`__uniwind-platform-${_reactNative.Platform.OS}`];
    const runtimeThemeVars = this.runtimeThemeVariables.get(this.runtime.currentThemeName);
    if (themeVars) {
      Object.defineProperties(this.vars, Object.getOwnPropertyDescriptors(themeVars));
    }
    if (platformVars) {
      Object.defineProperties(this.vars, Object.getOwnPropertyDescriptors(platformVars));
    }
    if (runtimeThemeVars) {
      Object.defineProperties(this.vars, Object.getOwnPropertyDescriptors(runtimeThemeVars));
    }
    if (__DEV__ && generateStyleSheetCallback) {
      _listener.UniwindListener.notifyAll();
    }
  };
  resolveStyles(classNames, componentProps, state, groupContext, childrenProps) {
    const result = {};
    let vars = this.vars;
    let hasDataAttributes = false;
    let hasGroup = false;
    let hasHas = false;
    const dependencies = /* @__PURE__ */new Set();
    let dependencySum = 0;
    const bestBreakpoints = /* @__PURE__ */new Map();
    for (const className of classNames.split(" ")) {
      if (!(className in this.stylesheet)) {
        continue;
      }
      for (const style of this.stylesheet[className]) {
        if (style.dependencies) {
          style.dependencies.forEach(dep => {
            dependencies.add(dep);
            dependencySum |= 1 << dep;
          });
        }
        if (style.dataAttributes !== null) {
          hasDataAttributes = true;
        }
        if (style.group !== null) {
          hasGroup = true;
        }
        if (style.has !== null) {
          hasHas = true;
        }
        if (style.minWidth > this.runtime.screen.width || style.maxWidth < this.runtime.screen.width || style.theme !== null && this.runtime.currentThemeName !== style.theme || style.orientation !== null && this.runtime.orientation !== style.orientation || style.rtl !== null && this.runtime.rtl !== style.rtl || style.active !== null && state?.isPressed !== style.active || style.focus !== null && state?.isFocused !== style.focus || style.disabled !== null && state?.isDisabled !== style.disabled || style.dataAttributes !== null && !this.validateDataAttributes(style.dataAttributes, componentProps) || style.group !== null && !this.validateGroup(style.group, groupContext) || style.has !== null && !this.validateHas(style.has, childrenProps)) {
          continue;
        }
        for (const [property, valueGetter] of style.entries) {
          const previousBest = bestBreakpoints.get(property);
          if (previousBest && (previousBest.minWidth > style.minWidth || previousBest.complexity > style.complexity || previousBest.importantProperties.includes(property))) {
            continue;
          }
          if (property[0] === "-") {
            if (vars === this.vars) {
              vars = (0, _nativeUtils.cloneWithAccessors)(this.vars);
            }
            Object.defineProperty(vars, property, {
              configurable: true,
              enumerable: true,
              get: valueGetter
            });
          } else {
            Object.defineProperty(result, property, {
              configurable: true,
              enumerable: true,
              get: () => valueGetter.call(vars)
            });
          }
          bestBreakpoints.set(property, style);
        }
      }
    }
    if (result.lineHeight !== void 0 && result.lineHeight < 6) {
      Object.defineProperty(result, "lineHeight", {
        value: result.fontSize * result.lineHeight,
        configurable: true,
        enumerable: true
      });
    }
    if (result.boxShadow !== void 0) {
      Object.defineProperty(result, "boxShadow", {
        value: (0, _parsers.parseBoxShadow)(result.boxShadow),
        configurable: true,
        enumerable: true
      });
    }
    if (result.visibility === "hidden") {
      Object.defineProperty(result, "display", {
        value: "none",
        configurable: true,
        enumerable: true
      });
    }
    if (result.borderStyle !== void 0 && result.borderColor === void 0) {
      Object.defineProperty(result, "borderColor", {
        value: "#000000",
        configurable: true,
        enumerable: true
      });
    }
    if (result.outlineStyle !== void 0 && result.outlineColor === void 0) {
      Object.defineProperty(result, "outlineColor", {
        value: "#000000",
        configurable: true,
        enumerable: true
      });
    }
    if (result.fontVariant !== void 0) {
      Object.defineProperty(result, "fontVariant", {
        value: (0, _parsers.parseFontVariant)(result.fontVariant),
        configurable: true,
        enumerable: true
      });
    }
    (0, _parsers.parseTransformsMutation)(result);
    if (result.experimental_backgroundImage !== void 0) {
      Object.defineProperty(result, "experimental_backgroundImage", {
        value: (0, _parsers.resolveGradient)(result.experimental_backgroundImage),
        configurable: true,
        enumerable: true
      });
    }
    if (result.textShadow !== void 0) {
      (0, _parsers.parseTextShadowMutation)(result);
    }
    return {
      styles: {
        ...result
      },
      dependencies: Array.from(dependencies),
      dependencySum,
      hasDataAttributes,
      hasGroup,
      hasHas
    };
  }
  validateGroup(groupCondition, groupContext = {}) {
    const groupStates = groupContext[groupCondition.name];
    if (!groupStates || groupStates.length === 0) {
      return false;
    }
    return groupStates.some(groupState => {
      if (groupCondition.active !== void 0 && groupState.isPressed !== groupCondition.active) {
        return false;
      }
      if (groupCondition.focus !== void 0 && groupState.isFocused !== groupCondition.focus) {
        return false;
      }
      if (groupCondition.disabled !== void 0 && groupState.isDisabled !== groupCondition.disabled) {
        return false;
      }
      if (groupCondition.dataAttributes !== void 0) {
        if (!this.validateDataAttributes(groupCondition.dataAttributes, groupState.dataAttributes)) {
          return false;
        }
      }
      if (groupCondition.has !== void 0) {
        if (!this.validateHas(groupCondition.has, groupState.childrenProps)) {
          return false;
        }
      }
      return true;
    });
  }
  validateHas(hasCondition, childrenProps = []) {
    for (const childProps of childrenProps) {
      if (this.validateDataAttributes(hasCondition, childProps)) {
        return true;
      }
    }
    return false;
  }
  validateDataAttributes(dataAttributes, props = {}) {
    for (const [attribute, expectedAttributeValue] of Object.entries(dataAttributes)) {
      const attributeValue = props[attribute];
      if (expectedAttributeValue === "true") {
        if (attributeValue !== true && attributeValue !== "true") {
          return false;
        }
        continue;
      }
      if (expectedAttributeValue === "false") {
        if (attributeValue !== false && attributeValue !== "false") {
          return false;
        }
        continue;
      }
      if (attributeValue !== expectedAttributeValue) {
        return false;
      }
    }
    return true;
  }
}
const UniwindStore = exports.UniwindStore = new UniwindStoreBuilder();
_reactNative.Dimensions.addEventListener("change", ({
  window
}) => {
  const newOrientation = window.width > window.height ? _types.Orientation.Landscape : _types.Orientation.Portrait;
  const orientationChanged = UniwindStore.runtime.orientation !== newOrientation;
  UniwindStore.runtime.screen = {
    width: window.width,
    height: window.height
  };
  UniwindStore.runtime.orientation = newOrientation;
  _listener.UniwindListener.notify([...(orientationChanged ? [_types.StyleDependency.Orientation] : []), _types.StyleDependency.Dimensions]);
});