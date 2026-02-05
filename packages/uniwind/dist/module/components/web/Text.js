import { jsx } from "react/jsx-runtime";
import { Text as RNText } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const Text = copyComponentProperties(RNText, (props) => {
  return /* @__PURE__ */ jsx(
    RNText,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style]
    }
  );
});
export default Text;
