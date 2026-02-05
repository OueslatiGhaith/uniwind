'use strict';

const node = require('@tailwindcss/node');
const path = require('path');
const stringifyThemes = require('../shared/uniwind.BOif-Zzr.cjs');
const common = require('../shared/uniwind.DXJvW-Vd.cjs');
require('fs');
require('lightningcss');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const path__default = /*#__PURE__*/_interopDefaultCompat(path);

const dirname = typeof __dirname !== "undefined" ? __dirname : undefined;
const componentPath = path__default.resolve(
  dirname,
  "../module/components/web/index.js"
);
const styleSheetPath = path__default.resolve(
  dirname,
  "../module/components/web/createOrderedCSSStyleSheet.js"
);
const uniwind = ({
  cssEntryFile,
  extraThemes,
  dtsFile = "uniwind-types.d.ts"
}) => {
  const themes = common.uniq([
    "light",
    "dark",
    ...extraThemes ?? []
  ]);
  const stringifiedThemes = stringifyThemes.stringifyThemes(themes);
  return {
    name: "uniwind",
    config: () => ({
      css: {
        transformer: "lightningcss",
        lightningcss: {
          visitor: {
            Function: stringifyThemes.processFunctions
          }
        }
      },
      optimizeDeps: {
        exclude: [stringifyThemes.name, "react-native"],
        esbuildOptions: {
          plugins: [{
            name: "uniwind-esbuild-plugin",
            setup: (build) => {
              build.onResolve(
                { filter: /^\.\/createOrderedCSSStyleSheet$/ },
                (args) => {
                  if (node.normalizePath(args.importer).includes("react-native-web/dist/exports/StyleSheet")) {
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
                if (importer !== void 0 && node.normalizePath(importer).includes(`${stringifyThemes.name}/dist`)) {
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
      const normalizedId = node.normalizePath(id);
      if (normalizedId.includes(`${stringifyThemes.name}/dist`) && normalizedId.includes("config/config.js")) {
        return {
          code: `${code}Uniwind.__reinit(() => ({}), ${stringifiedThemes})`
        };
      }
    },
    buildStart: async () => {
      await stringifyThemes.buildCSS(themes, cssEntryFile);
      stringifyThemes.buildDtsFile(dtsFile, stringifiedThemes);
    },
    generateBundle: async () => {
      await stringifyThemes.buildCSS(themes, cssEntryFile);
      stringifyThemes.buildDtsFile(dtsFile, stringifiedThemes);
    }
  };
};

exports.uniwind = uniwind;
