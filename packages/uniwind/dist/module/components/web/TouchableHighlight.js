import { jsx } from "react/jsx-runtime";
import { TouchableHighlight as RNTouchableHighlight } from "react-native";
import { useUniwindAccent } from "../../hooks/index.js";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const TouchableHighlight = copyComponentProperties(RNTouchableHighlight, (props) => {
  const underlayColor = useUniwindAccent(props.underlayColorClassName);
  return /* @__PURE__ */ jsx(
    RNTouchableHighlight,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style],
      underlayColor: props.underlayColor ?? underlayColor
    }
  );
});
export default TouchableHighlight;
