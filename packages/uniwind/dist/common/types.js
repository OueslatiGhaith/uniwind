"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyleDependency = exports.Orientation = exports.ColorScheme = void 0;
var StyleDependency = exports.StyleDependency = /* @__PURE__ */(StyleDependency2 => {
  StyleDependency2[StyleDependency2["ColorScheme"] = 1] = "ColorScheme";
  StyleDependency2[StyleDependency2["Theme"] = 2] = "Theme";
  StyleDependency2[StyleDependency2["Dimensions"] = 3] = "Dimensions";
  StyleDependency2[StyleDependency2["Orientation"] = 4] = "Orientation";
  StyleDependency2[StyleDependency2["Insets"] = 5] = "Insets";
  StyleDependency2[StyleDependency2["FontScale"] = 6] = "FontScale";
  StyleDependency2[StyleDependency2["Rtl"] = 7] = "Rtl";
  StyleDependency2[StyleDependency2["AdaptiveThemes"] = 8] = "AdaptiveThemes";
  StyleDependency2[StyleDependency2["Variables"] = 9] = "Variables";
  return StyleDependency2;
})(StyleDependency || {});
var Orientation = exports.Orientation = /* @__PURE__ */(Orientation2 => {
  Orientation2["Portrait"] = "portrait";
  Orientation2["Landscape"] = "landscape";
  return Orientation2;
})(Orientation || {});
var ColorScheme = exports.ColorScheme = /* @__PURE__ */(ColorScheme2 => {
  ColorScheme2["Light"] = "light";
  ColorScheme2["Dark"] = "dark";
  return ColorScheme2;
})(ColorScheme || {});