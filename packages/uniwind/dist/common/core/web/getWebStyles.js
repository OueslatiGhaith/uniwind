"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebStyles = void 0;
var _parseCSSValue = require("./parseCSSValue");
const dummy = typeof document !== "undefined" ? Object.assign(document.createElement("div"), {
  style: "display: none"
}) : null;
if (dummy) {
  document.body.appendChild(dummy);
}
const getComputedStyles = () => {
  if (!dummy) {
    return {};
  }
  const computedStyles = window.getComputedStyle(dummy);
  const styles = {};
  for (let i = 0; i < computedStyles.length; i++) {
    const prop = computedStyles[i];
    styles[prop] = computedStyles.getPropertyValue(prop);
  }
  return styles;
};
const initialStyles = typeof document !== "undefined" ? getComputedStyles() : {};
const getObjectDifference = (obj1, obj2) => {
  const diff = {};
  const keys = Object.keys(obj2);
  keys.forEach(key => {
    if (obj2[key] !== obj1[key]) {
      diff[key] = obj2[key];
    }
  });
  return diff;
};
const getWebStyles = className => {
  if (className === void 0) {
    return {};
  }
  if (!dummy) {
    return {};
  }
  dummy.className = className;
  const computedStyles = getObjectDifference(initialStyles, getComputedStyles());
  return Object.fromEntries(Object.entries(computedStyles).map(([key, value]) => {
    const parsedKey = key[0] === "-" ? key : key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return [parsedKey, (0, _parseCSSValue.parseCSSValue)(value)];
  }));
};
exports.getWebStyles = getWebStyles;