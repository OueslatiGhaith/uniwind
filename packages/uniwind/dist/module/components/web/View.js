import { jsx } from "react/jsx-runtime";
import { View as RNView } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const View = copyComponentProperties(RNView, (props) => {
  return /* @__PURE__ */ jsx(
    RNView,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style]
    }
  );
});
export default View;
