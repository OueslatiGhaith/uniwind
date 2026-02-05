import { jsx } from "react/jsx-runtime";
import { TouchableOpacity as RNTouchableOpacity } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const TouchableOpacity = copyComponentProperties(RNTouchableOpacity, (props) => {
  return /* @__PURE__ */ jsx(
    RNTouchableOpacity,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style]
    }
  );
});
export default TouchableOpacity;
