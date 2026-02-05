"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniwind = void 0;
var _node = require("@tailwindcss/node");
var _path = _interopRequireDefault(require("path"));
var _package = require("../../package.json");
var _css = require("../css");
var _processFunctions = require("../css/processFunctions");
var _utils = require("../metro/utils");
var _buildDtsFile = require("../utils/buildDtsFile");
var _stringifyThemes = require("../utils/stringifyThemes");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const dirname = typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;
const componentPath = _path.default.resolve(dirname, "../module/components/web/index.js");
const styleSheetPath = _path.default.resolve(dirname, "../module/components/web/createOrderedCSSStyleSheet.js");
const uniwind = ({
  cssEntryFile,
  extraThemes,
  dtsFile = "uniwind-types.d.ts"
}) => {
  const themes = (0, _utils.uniq)(["light", "dark", ...(extraThemes ?? [])]);
  const stringifiedThemes = (0, _stringifyThemes.stringifyThemes)(themes);
  return {
    name: "uniwind",
    config: () => ({
      css: {
        transformer: "lightningcss",
        lightningcss: {
          visitor: {
            Function: _processFunctions.processFunctions
          }
        }
      },
      optimizeDeps: {
        exclude: [_package.name, "react-native"],
        esbuildOptions: {
          plugins: [{
            name: "uniwind-esbuild-plugin",
            setup: build => {
              build.onResolve({
                filter: /^\.\/createOrderedCSSStyleSheet$/
              }, args => {
                if ((0, _node.normalizePath)(args.importer).includes("react-native-web/dist/exports/StyleSheet")) {
                  return {
                    path: styleSheetPath
                  };
                }
              });
            }
          }]
        }
      },
      resolve: {
        alias: [{
          find: /^react-native$/,
          replacement: componentPath,
          customResolver: {
            resolveId(_, importer) {
              if (importer !== void 0 && (0, _node.normalizePath)(importer).includes(`${_package.name}/dist`)) {
                return this.resolve("react-native-web");
              }
              return componentPath;
            }
          }
        }]
      }
    }),
    transform: (code, id) => {
      const normalizedId = (0, _node.normalizePath)(id);
      if (normalizedId.includes(`${_package.name}/dist`) && normalizedId.includes("config/config.js")) {
        return {
          code: `${code}Uniwind.__reinit(() => ({}), ${stringifiedThemes})`
        };
      }
    },
    buildStart: async () => {
      await (0, _css.buildCSS)(themes, cssEntryFile);
      (0, _buildDtsFile.buildDtsFile)(dtsFile, stringifiedThemes);
    },
    generateBundle: async () => {
      await (0, _css.buildCSS)(themes, cssEntryFile);
      (0, _buildDtsFile.buildDtsFile)(dtsFile, stringifiedThemes);
    }
  };
};
exports.uniwind = uniwind;