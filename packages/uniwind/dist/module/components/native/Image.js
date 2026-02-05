import { jsx } from "react/jsx-runtime";
import { Image as RNImage } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const Image = copyComponentProperties(RNImage, (props) => {
  const style = useStyle(props.className, props);
  const tintColor = useStyle(props.tintColorClassName, props).accentColor;
  return /* @__PURE__ */ jsx(
    RNImage,
    {
      ...props,
      style: [style, props.style],
      tintColor: props.tintColor ?? tintColor
    }
  );
});
export default Image;
