import { useEffect, useState } from "react";
import { Uniwind } from "../core/index.js";
import { UniwindListener } from "../core/listener.js";
import { StyleDependency } from "../types.js";
export const useUniwind = () => {
  const [theme, setTheme] = useState(Uniwind.currentTheme);
  const [hasAdaptiveThemes, setHasAdaptiveThemes] = useState(Uniwind.hasAdaptiveThemes);
  useEffect(() => {
    const dispose = UniwindListener.subscribe(() => {
      setTheme(Uniwind.currentTheme);
      setHasAdaptiveThemes(Uniwind.hasAdaptiveThemes);
    }, [StyleDependency.Theme, StyleDependency.AdaptiveThemes]);
    return () => {
      dispose();
    };
  }, []);
  return {
    theme,
    hasAdaptiveThemes
  };
};
