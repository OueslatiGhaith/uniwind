import { jsx } from "react/jsx-runtime";
import { RefreshControl as RNRefreshControl } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const RefreshControl = copyComponentProperties(RNRefreshControl, (props) => {
  const style = useStyle(props.className, props);
  const color = useStyle(props.colorsClassName, props).accentColor;
  const tintColor = useStyle(props.tintColorClassName, props).accentColor;
  const titleColor = useStyle(props.titleColorClassName, props).accentColor;
  const progressBackgroundColor = useStyle(props.progressBackgroundColorClassName, props).accentColor;
  return /* @__PURE__ */ jsx(
    RNRefreshControl,
    {
      ...props,
      style: [style, props.style],
      colors: props.colors ?? (color !== void 0 ? [color] : void 0),
      tintColor: props.tintColor ?? tintColor,
      titleColor: props.titleColor ?? titleColor,
      progressBackgroundColor: props.progressBackgroundColor ?? progressBackgroundColor
    }
  );
});
export default RefreshControl;
