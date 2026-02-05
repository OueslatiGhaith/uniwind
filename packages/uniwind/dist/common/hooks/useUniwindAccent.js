"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useUniwindAccent = void 0;
var _formatColor = require("../core/web/formatColor");
var _useResolveClassNames = require("./useResolveClassNames");
const useUniwindAccent = className => {
  const styles = (0, _useResolveClassNames.useResolveClassNames)(className ?? "");
  return styles.accentColor !== void 0 ? (0, _formatColor.formatColor)(styles.accentColor) : void 0;
};
exports.useUniwindAccent = useUniwindAccent;