"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCSS = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _insets = require("./insets");
var _overwrite = require("./overwrite");
var _themes = require("./themes");
var _variants = require("./variants");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const dirname = typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;
const buildCSS = async (themes, input) => {
  const variants = (0, _variants.generateCSSForVariants)();
  const insets = (0, _insets.generateCSSForInsets)();
  const themesCSS = await (0, _themes.generateCSSForThemes)(themes, input);
  const cssFilePath = _path.default.join(dirname, "../../uniwind.css");
  const oldCSSFile = _fs.default.existsSync(cssFilePath) ? _fs.default.readFileSync(cssFilePath, "utf-8") : "";
  const newCssFile = [variants, insets, _overwrite.overwrite, themesCSS].join("\n");
  if (oldCSSFile === newCssFile) {
    return;
  }
  _fs.default.writeFileSync(cssFilePath, newCssFile);
};
exports.buildCSS = buildCSS;