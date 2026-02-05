import { jsx } from "react/jsx-runtime";
import { ScrollView as RNScrollView } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const ScrollView = copyComponentProperties(RNScrollView, (props) => {
  const style = useStyle(props.className, props);
  const contentContainerStyle = useStyle(props.contentContainerClassName, props);
  const endFillColor = useStyle(props.endFillColorClassName, props).accentColor;
  return /* @__PURE__ */ jsx(
    RNScrollView,
    {
      ...props,
      style: [style, props.style],
      contentContainerStyle: [contentContainerStyle, props.contentContainerStyle],
      endFillColor: props.endFillColor ?? endFillColor
    }
  );
});
export default ScrollView;
