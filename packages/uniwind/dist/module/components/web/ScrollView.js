import { jsx } from "react/jsx-runtime";
import { ScrollView as RNScrollView } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const ScrollView = copyComponentProperties(RNScrollView, (props) => {
  return /* @__PURE__ */ jsx(
    RNScrollView,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style],
      contentContainerStyle: [toRNWClassName(props.contentContainerClassName), props.contentContainerStyle]
    }
  );
});
export default ScrollView;
