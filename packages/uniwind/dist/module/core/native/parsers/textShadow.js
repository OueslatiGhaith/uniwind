export const parseTextShadowMutation = (styles) => {
  const tokens = styles.textShadow.replace(/,/g, "").split(" ");
  if (tokens.length === 0) {
    return;
  }
  const color = tokens.find((token) => token.startsWith("#")) ?? "#000000";
  const offsets = tokens.filter((token) => token !== color);
  const [offsetX, offsetY, radius] = offsets;
  if (offsetX !== void 0 && offsetY !== void 0) {
    Object.defineProperty(styles, "textShadowOffset", {
      configurable: true,
      enumerable: true,
      value: {
        width: Number(offsetX),
        height: Number(offsetY)
      }
    });
    delete styles.textShadow;
  }
  if (radius !== void 0) {
    Object.defineProperty(styles, "textShadowRadius", {
      configurable: true,
      enumerable: true,
      value: Number(radius)
    });
  }
  Object.defineProperty(styles, "textShadowColor", {
    configurable: true,
    enumerable: true,
    value: color
  });
};
