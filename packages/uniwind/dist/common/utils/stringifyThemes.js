"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyThemes = void 0;
const stringifyThemes = (themes = []) => `[${themes.map(theme => `'${theme}'`).join(", ")}]`;
exports.stringifyThemes = stringifyThemes;