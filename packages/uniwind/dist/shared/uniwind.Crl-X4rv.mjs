import fs from 'fs';
import path from 'path';
import { compile } from '@tailwindcss/node';
import { transform } from 'lightningcss';

const red = "\x1B[91m";
const yellow = "\x1B[33m";
const blue = "\x1B[36m";
const reset = "\x1B[0m";
class Logger {
  constructor(name) {
    this.name = name;
  }
  static debug = false;
  static log(message, meta = "") {
    if (!Logger.debug) {
      return;
    }
    console.log(`${blue}Uniwind ${meta}- ${message}${reset}`);
  }
  static error(message, meta = "") {
    console.log(`${red}Uniwind Error ${meta}- ${message}${reset}`);
  }
  static warn(message, meta = "") {
    if (!Logger.debug) {
      return;
    }
    console.log(`${yellow}Uniwind Warning ${meta}- ${message}${reset}`);
  }
  log(message) {
    Logger.log(message, `[${this.name} Processor] `);
  }
  error(message) {
    Logger.error(message, `[${this.name} Processor] `);
  }
  warn(message) {
    Logger.warn(message, `[${this.name} Processor] `);
  }
}

const name = "uniwind";

const ONE_PX = {
  type: "token",
  value: { type: "dimension", unit: "px", value: 1 }
};
const processFunctions = {
  pixelRatio: (fn) => {
    return {
      type: "function",
      value: {
        name: "calc",
        arguments: [
          fn.arguments.at(0) ?? ONE_PX,
          { type: "token", value: { type: "delim", value: "*" } },
          ONE_PX
        ]
      }
    };
  },
  fontScale: (fn) => {
    return {
      type: "function",
      value: {
        name: "calc",
        arguments: [
          fn.arguments.at(0) ?? ONE_PX,
          { type: "token", value: { type: "delim", value: "*" } },
          {
            type: "token",
            value: { type: "dimension", value: 1, unit: "rem" }
          }
        ]
      }
    };
  },
  hairlineWidth: () => ONE_PX
};

const types = ["margin", "padding", "inset"];
const sides = ["inset", "x", "y", "top", "bottom", "left", "right"];
const safeAreaTypes = ["safe", "safe-or-*", "safe-offset-*"];
const spacing = "--spacing(--value(integer))";
const length = "--value([length], --spacing-*)";
const generateCSSForInsets = () => {
  let css = `@utility h-screen-safe {
    height: calc(100vh - (env(safe-area-inset-top) + env(safe-area-inset-bottom)));
}

`;
  const getInsetsForSide = (side) => {
    switch (side) {
      case "top":
        return ["top"];
      case "bottom":
        return ["bottom"];
      case "left":
        return ["left"];
      case "right":
        return ["right"];
      case "x":
        return ["left", "right"];
      case "y":
        return ["top", "bottom"];
      case "inset":
        return ["top", "bottom", "left", "right"];
      default:
        return [];
    }
  };
  const getUtilityName = (typeName, side, safeAreaType) => {
    if (typeName === "inset") {
      return `${side}-${safeAreaType}`;
    }
    const sideSuffix = side === "inset" ? "" : side.at(0);
    return `${typeName.at(0)}${sideSuffix}-${safeAreaType}`;
  };
  const getStyleProperty = (typeName, inset) => {
    if (typeName === "inset") {
      return inset;
    }
    return `${typeName}-${inset}`;
  };
  const getStylesForSafeAreaType = (safeAreaType, styles) => {
    switch (safeAreaType) {
      case "safe":
        return styles;
      case "safe-or-*":
        return styles.flatMap((style) => {
          const styleWithoutSemicolon = style.replace(";", "");
          return [
            styleWithoutSemicolon.replace(/: (env.*)/, (_, env) => `: max(${env}, ${spacing});`),
            styleWithoutSemicolon.replace(/: (env.*)/, (_, env) => `: max(${env}, ${length});`)
          ];
        });
      case "safe-offset-*":
        return styles.flatMap((style) => {
          const styleWithoutSemicolon = style.replace(";", "");
          return [
            styleWithoutSemicolon.replace(/: (env.*)/, (_, env) => `: calc(${env} + ${spacing});`),
            styleWithoutSemicolon.replace(/: (env.*)/, (_, env) => `: calc(${env} + ${length});`)
          ];
        });
      default:
        return [];
    }
  };
  types.forEach((type) => {
    sides.forEach((side) => {
      const insets = getInsetsForSide(side);
      const styles = insets.map((inset) => `${getStyleProperty(type, inset)}: env(safe-area-inset-${inset});`);
      safeAreaTypes.forEach((safeAreaType) => {
        const utilityName = getUtilityName(type, side, safeAreaType);
        css += [
          `@utility ${utilityName} {`,
          ...getStylesForSafeAreaType(safeAreaType, styles).map((style) => `    ${style}`),
          "}",
          "",
          ""
        ].join("\n");
      });
    });
  });
  return css.slice(0, -1);
};

const overwriteDisabled = `@custom-variant disabled {
    &:disabled {
        @slot;
    }

    &[aria-disabled="true"] {
        @slot;
    }

    &[readonly] {
        @slot;
    }
}
`;
const overwrite = overwriteDisabled;

const readFileSafe = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
};
const isExcludedDependency = (url) => [
  url.includes("node_modules/tailwindcss"),
  url.includes("node_modules/@tailwindcss"),
  url.includes("node_modules/uniwind")
].some(Boolean);
const generateCSSForThemes = async (themes, input) => {
  const themesVariables = Object.fromEntries(themes.map((theme) => [theme, /* @__PURE__ */ new Set()]));
  const findVariantsRec = async (cssPath) => {
    const css = readFileSafe(cssPath);
    if (css === null) {
      return;
    }
    const { dependencies } = transform({
      code: Buffer.from(css),
      filename: "uniwind.css",
      analyzeDependencies: true,
      visitor: {
        Rule: (rule) => {
          if (rule.type === "unknown" && rule.value.name === "variant") {
            const [firstPrelude] = rule.value.prelude;
            if (firstPrelude?.type !== "token" || firstPrelude.value.type !== "ident" || !themes.includes(firstPrelude.value.value)) {
              return;
            }
            const theme = firstPrelude.value.value;
            rule.value.block?.forEach((block) => {
              if (block.type === "dashed-ident") {
                themesVariables[theme]?.add(block.value);
              }
            });
          }
        }
      }
    });
    if (!Array.isArray(dependencies)) {
      return;
    }
    const importUrls = /* @__PURE__ */ new Set();
    const importsCSS = dependencies.filter((dependency) => {
      if (dependency.url.startsWith(".")) {
        importUrls.add(path.resolve(path.dirname(cssPath), dependency.url));
        return false;
      }
      return !isExcludedDependency(dependency.url);
    }).map((dependency) => `@import "${dependency.url}";`).join("\n");
    await compile(importsCSS, {
      base: path.resolve(path.dirname(cssPath)),
      onDependency: (dependency) => {
        if (isExcludedDependency(dependency)) {
          return;
        }
        importUrls.add(dependency);
      }
    });
    for (const filePath of importUrls) {
      await findVariantsRec(filePath);
    }
  };
  await findVariantsRec(input);
  let hasErrors = false;
  const hasVariables = Object.values(themesVariables).some((variables) => variables.size > 0);
  Object.values(themesVariables).forEach((variables) => {
    Object.entries(themesVariables).forEach(([checkedTheme, checkedVariables]) => {
      variables.forEach((variable) => {
        if (!checkedVariables.has(variable)) {
          Logger.error(`Theme ${checkedTheme} is missing variable ${variable}`);
          hasErrors = true;
        }
      });
    });
  });
  if (hasErrors) {
    Logger.error("All themes must have the same variables");
  }
  const variablesCSS = hasVariables ? [
    "",
    "@theme {",
    ...Array.from(Object.values(themesVariables).at(0) ?? []).map((variable) => `    ${variable}: unset;`),
    "}"
  ] : [];
  const uniwindCSS = [
    ...themes.map((theme) => {
      const notOtherThemes = themes.map((t) => `.${t}, .${t} *`);
      if (theme === "dark" || theme === "light") {
        return [
          `@custom-variant ${theme} {`,
          `   &:where(.${theme}, .${theme} *) {`,
          "       @slot;",
          "   }",
          "",
          `   @media (prefers-color-scheme: ${theme}) {`,
          `       &:not(:where(${notOtherThemes.join(", ")})) {`,
          "           @slot;",
          "       }",
          "   }",
          "}",
          ""
        ].join("\n");
      }
      return `@custom-variant ${theme} (&:where(.${theme}, .${theme} *));`;
    }),
    ...variablesCSS
  ].join("\n");
  return uniwindCSS;
};

const variants = ["ios", "android", "web", "native"];
const generateCSSForVariants = () => {
  let css = "";
  variants.forEach((variant) => {
    css += `@custom-variant ${variant} (${variant === "web" ? "html &" : `@media ${variant}`});
`;
  });
  return css;
};

const dirname = typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;
const buildCSS = async (themes, input) => {
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

const buildDtsFile = (dtsPath, stringifiedThemes) => {
  const oldDtsContent = fs.existsSync(dtsPath) ? fs.readFileSync(dtsPath, "utf-8") : "";
  const dtsContent = [
    `// NOTE: This file is generated by ${name} and it should not be edited manually.`,
    `/// <reference types="${name}/types" />`,
    "",
    `declare module '${name}' {`,
    `    export interface UniwindConfig {`,
    `        themes: readonly ${stringifiedThemes}`,
    `    }`,
    `}`,
    "",
    `export {}`,
    ""
  ].join("\n");
  if (oldDtsContent === dtsContent) {
    return;
  }
  fs.writeFileSync(dtsPath, dtsContent);
};

const stringifyThemes = (themes = []) => `[${themes.map((theme) => `'${theme}'`).join(", ")}]`;

export { Logger as L, buildCSS as a, buildDtsFile as b, name as n, processFunctions as p, stringifyThemes as s };
