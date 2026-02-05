import { jsx } from "react/jsx-runtime";
import { Pressable as RNPressable } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const Pressable = copyComponentProperties(RNPressable, (props) => {
  return /* @__PURE__ */ jsx(
    RNPressable,
    {
      ...props,
      style: (state) => [toRNWClassName(props.className), typeof props.style === "function" ? props.style(state) : props.style]
    }
  );
});
export default Pressable;
