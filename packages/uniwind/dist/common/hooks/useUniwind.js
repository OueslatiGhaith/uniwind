"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useUniwind = void 0;
var _react = require("react");
var _core = require("../core");
var _listener = require("../core/listener");
var _types = require("../types");
const useUniwind = () => {
  const [theme, setTheme] = (0, _react.useState)(_core.Uniwind.currentTheme);
  const [hasAdaptiveThemes, setHasAdaptiveThemes] = (0, _react.useState)(_core.Uniwind.hasAdaptiveThemes);
  (0, _react.useEffect)(() => {
    const dispose = _listener.UniwindListener.subscribe(() => {
      setTheme(_core.Uniwind.currentTheme);
      setHasAdaptiveThemes(_core.Uniwind.hasAdaptiveThemes);
    }, [_types.StyleDependency.Theme, _types.StyleDependency.AdaptiveThemes]);
    return () => {
      dispose();
    };
  }, []);
  return {
    theme,
    hasAdaptiveThemes
  };
};
exports.useUniwind = useUniwind;