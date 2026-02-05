"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UniwindListener = void 0;
var _types = require("../types");
class UniwindListenerBuilder {
  listeners = {
    [_types.StyleDependency.ColorScheme]: /* @__PURE__ */new Set(),
    [_types.StyleDependency.Theme]: /* @__PURE__ */new Set(),
    [_types.StyleDependency.Dimensions]: /* @__PURE__ */new Set(),
    [_types.StyleDependency.Orientation]: /* @__PURE__ */new Set(),
    [_types.StyleDependency.Insets]: /* @__PURE__ */new Set(),
    [_types.StyleDependency.FontScale]: /* @__PURE__ */new Set(),
    [_types.StyleDependency.Rtl]: /* @__PURE__ */new Set(),
    [_types.StyleDependency.AdaptiveThemes]: /* @__PURE__ */new Set(),
    [_types.StyleDependency.Variables]: /* @__PURE__ */new Set()
  };
  notify(dependencies) {
    dependencies.forEach(dep => {
      this.listeners[dep].forEach(callback => callback());
    });
  }
  notifyAll() {
    Object.values(this.listeners).forEach(listenerSet => {
      listenerSet.forEach(callback => callback());
    });
  }
  subscribe(listener, dependencies, options) {
    const wrappedListeners = /* @__PURE__ */new Map();
    const dispose = () => {
      wrappedListeners.forEach((wrappedListener, dep) => {
        this.listeners[dep].delete(wrappedListener);
      });
      wrappedListeners.clear();
    };
    dependencies.forEach(dep => {
      const wrappedListener = () => {
        listener();
        if (options?.once) {
          dispose();
        }
      };
      wrappedListeners.set(dep, wrappedListener);
      this.listeners[dep].add(wrappedListener);
    });
    return dispose;
  }
}
const UniwindListener = exports.UniwindListener = new UniwindListenerBuilder();