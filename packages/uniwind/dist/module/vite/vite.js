import { normalizePath } from "@tailwindcss/node";
import path from "path";
import { name as UNIWIND_PACKAGE_NAME } from "../../package.json";
import { buildCSS } from "../css/index.js";
import { processFunctions } from "../css/processFunctions.js";
import { uniq } from "../metro/utils";
import { buildDtsFile } from "../utils/buildDtsFile.js";
import { stringifyThemes } from "../utils/stringifyThemes.js";
const dirname = typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;
const componentPath = path.resolve(
  dirname,
  "../module/components/web/index.js"
);
const styleSheetPath = path.resolve(
  dirname,
  "../module/components/web/createOrderedCSSStyleSheet.js"
);
export const uniwind = ({
  cssEntryFile,
  extraThemes,
  dtsFile = "uniwind-types.d.ts"
}) => {
  const themes = uniq([
    "light",
    "dark",
    ...extraThemes ?? []
  ]);
  const stringifiedThemes = stringifyThemes(themes);
  return {
    name: "uniwind",
    config: () => ({
      css: {
        transformer: "lightningcss",
        lightningcss: {
          visitor: {
            Function: processFunctions
          }
        }
      },
      optimizeDeps: {
        exclude: [UNIWIND_PACKAGE_NAME, "react-native"],
        esbuildOptions: {
          plugins: [{
            name: "uniwind-esbuild-plugin",
            setup: (build) => {
              build.onResolve(
                { filter: /^\.\/createOrderedCSSStyleSheet$/ },
                (args) => {
                  if (normalizePath(args.importer).includes("react-native-web/dist/exports/StyleSheet")) {
                    return { path: styleSheetPath };
                  }
                }
              );
            }
          }]
        }
      },
      resolve: {
        alias: [
          {
            find: /^react-native$/,
            replacement: componentPath,
            customResolver: {
              resolveId(_, importer) {
                if (importer !== void 0 && normalizePath(importer).includes(`${UNIWIND_PACKAGE_NAME}/dist`)) {
                  return this.resolve("react-native-web");
                }
                return componentPath;
              }
            }
          }
        ]
      }
    }),
    transform: (code, id) => {
      const normalizedId = normalizePath(id);
      if (normalizedId.includes(`${UNIWIND_PACKAGE_NAME}/dist`) && normalizedId.includes("config/config.js")) {
        return {
          code: `${code}Uniwind.__reinit(() => ({}), ${stringifiedThemes})`
        };
      }
    },
    buildStart: async () => {
      await buildCSS(themes, cssEntryFile);
      buildDtsFile(dtsFile, stringifiedThemes);
    },
    generateBundle: async () => {
      await buildCSS(themes, cssEntryFile);
      buildDtsFile(dtsFile, stringifiedThemes);
    }
  };
};
