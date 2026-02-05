"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSSListener = void 0;
var _types = require("../../types");
var _listener = require("../listener");
class CSSListenerBuilder {
  classNameMediaQueryListeners = /* @__PURE__ */new Map();
  listeners = /* @__PURE__ */new Map();
  registeredRules = /* @__PURE__ */new Map();
  processedStyleSheets = /* @__PURE__ */new WeakSet();
  pendingInitialization = void 0;
  constructor() {
    if (typeof document === "undefined") {
      return;
    }
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          this.scheduleInitialization();
        }
      }
    });
    this.initialize();
    observer.observe(document.head, {
      childList: true,
      subtree: false,
      attributes: true,
      attributeFilter: ["disabled", "media", "title", "href", "rel"]
    });
  }
  subscribeToClassName(classNames, listener) {
    const disposables = [];
    classNames.split(" ").forEach(className => {
      const mediaQuery = this.classNameMediaQueryListeners.get(className);
      if (!mediaQuery) {
        return () => {};
      }
      const listeners = this.listeners.get(mediaQuery);
      listeners?.add(listener);
      disposables.push(() => listeners?.delete(listener));
    });
    const disposeThemeListener = _listener.UniwindListener.subscribe(listener, [_types.StyleDependency.Theme]);
    return () => {
      disposables.forEach(disposable => disposable());
      disposeThemeListener();
    };
  }
  scheduleInitialization() {
    this.cancelPendingInitialization();
    if (typeof requestIdleCallback !== "undefined") {
      this.pendingInitialization = requestIdleCallback(() => {
        this.initialize();
      }, {
        timeout: 50
      });
      return;
    }
    this.pendingInitialization = setTimeout(() => {
      this.initialize();
    }, 50);
  }
  cancelPendingInitialization() {
    if (this.pendingInitialization !== void 0) {
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(this.pendingInitialization);
      } else {
        clearTimeout(this.pendingInitialization);
      }
      this.pendingInitialization = void 0;
    }
  }
  initialize() {
    this.pendingInitialization = void 0;
    for (const sheet of Array.from(document.styleSheets)) {
      if (this.processedStyleSheets.has(sheet)) {
        continue;
      }
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      if (!rules) {
        continue;
      }
      this.processedStyleSheets.add(sheet);
      this.addMediaQueriesDeep(rules);
    }
  }
  isStyleRule(rule) {
    return rule.constructor.name === "CSSStyleRule";
  }
  isMediaRule(rule) {
    return rule.constructor.name === "CSSMediaRule";
  }
  collectParentMediaQueries(rule, acc = []) {
    const {
      parentRule
    } = rule;
    if (!parentRule) {
      return [];
    }
    if (this.isMediaRule(parentRule)) {
      acc.push(parentRule);
    }
    const result = this.collectParentMediaQueries(parentRule, acc);
    acc.push(...result);
    return Array.from(new Set(acc));
  }
  addMediaQueriesDeep(rules) {
    for (const rule of Array.from(rules)) {
      if (this.isStyleRule(rule)) {
        const mediaQueries = this.collectParentMediaQueries(rule);
        if (mediaQueries.length > 0) {
          this.addMediaQuery(mediaQueries, rule.selectorText);
        }
        continue;
      }
      if ("cssRules" in rule && rule.cssRules instanceof CSSRuleList) {
        this.addMediaQueriesDeep(rule.cssRules);
        continue;
      }
    }
  }
  addMediaQuery(mediaQueries, className) {
    const rules = mediaQueries.map(mediaQuery => mediaQuery.conditionText).sort().join(" and ");
    const parsedClassName = className.replace(".", "").replace("\\", "");
    const cachedMediaQueryList = this.registeredRules.get(rules);
    if (cachedMediaQueryList) {
      this.classNameMediaQueryListeners.set(parsedClassName, cachedMediaQueryList);
      return;
    }
    const mediaQueryList = window.matchMedia(rules);
    this.registeredRules.set(rules, mediaQueryList);
    this.listeners.set(mediaQueryList, /* @__PURE__ */new Set());
    this.classNameMediaQueryListeners.set(parsedClassName, mediaQueryList);
    mediaQueryList.addEventListener("change", () => {
      this.listeners.get(mediaQueryList).forEach(listener => listener());
    });
  }
}
const CSSListener = exports.CSSListener = new CSSListenerBuilder();