"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCSSForVariants = void 0;
const variants = ["ios", "android", "web", "native"];
const generateCSSForVariants = () => {
  let css = "";
  variants.forEach(variant => {
    css += `@custom-variant ${variant} (${variant === "web" ? "html &" : `@media ${variant}`});
`;
  });
  return css;
};
exports.generateCSSForVariants = generateCSSForVariants;