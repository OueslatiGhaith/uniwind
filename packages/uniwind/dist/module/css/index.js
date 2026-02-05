import fs from "fs";
import path from "path";
import { generateCSSForInsets } from "./insets.js";
import { overwrite } from "./overwrite.js";
import { generateCSSForThemes } from "./themes.js";
import { generateCSSForVariants } from "./variants.js";
const dirname = typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;
export const buildCSS = async (themes, input) => {
  const variants = generateCSSForVariants();
  const insets = generateCSSForInsets();
  const themesCSS = await generateCSSForThemes(themes, input);
  const cssFilePath = path.join(dirname, "../../uniwind.css");
  const oldCSSFile = fs.existsSync(cssFilePath) ? fs.readFileSync(cssFilePath, "utf-8") : "";
  const newCssFile = [
    variants,
    insets,
    overwrite,
    themesCSS
  ].join("\n");
  if (oldCSSFile === newCssFile) {
    return;
  }
  fs.writeFileSync(
    cssFilePath,
    newCssFile
  );
};
