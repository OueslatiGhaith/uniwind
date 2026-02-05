import { jsx } from "react/jsx-runtime";
import { ImageBackground as RNImageBackground } from "react-native";
import { useUniwindAccent } from "../../hooks/index.js";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const ImageBackground = copyComponentProperties(RNImageBackground, (props) => {
  const tintColor = useUniwindAccent(props.tintColorClassName);
  return /* @__PURE__ */ jsx(
    RNImageBackground,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style],
      imageStyle: [toRNWClassName(props.imageClassName), props.imageStyle],
      tintColor: props.tintColor ?? tintColor
    }
  );
});
export default ImageBackground;
