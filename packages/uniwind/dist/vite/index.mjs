import { normalizePath } from '@tailwindcss/node';
import path from 'path';
import { s as stringifyThemes, n as name, p as processFunctions, a as buildCSS, b as buildDtsFile } from '../shared/uniwind.Crl-X4rv.mjs';
import { u as uniq } from '../shared/uniwind.CHGq2Q6z.mjs';
import 'fs';
import 'lightningcss';

const dirname = typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;
const componentPath = path.resolve(
  dirname,
  "../module/components/web/index.js"
);
const styleSheetPath = path.resolve(
  dirname,
  "../module/components/web/createOrderedCSSStyleSheet.js"
);
const uniwind = ({
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
        exclude: [name, "react-native"],
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
                if (importer !== void 0 && normalizePath(importer).includes(`${name}/dist`)) {
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
      if (normalizedId.includes(`${name}/dist`) && normalizedId.includes("config/config.js")) {
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

export { uniwind };
