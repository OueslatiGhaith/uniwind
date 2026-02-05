import { jsx } from "react/jsx-runtime";
import { ImageBackground as RNImageBackground } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const ImageBackground = copyComponentProperties(RNImageBackground, (props) => {
  const style = useStyle(props.className, props);
  const imageStyle = useStyle(props.imageClassName, props);
  const tintColor = useStyle(props.tintColorClassName, props).accentColor;
  return /* @__PURE__ */ jsx(
    RNImageBackground,
    {
      ...props,
      style: [style, props.style],
      imageStyle: [imageStyle, props.imageStyle],
      tintColor: props.tintColor ?? tintColor
    }
  );
});
export default ImageBackground;
