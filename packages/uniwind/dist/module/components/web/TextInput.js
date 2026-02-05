import { jsx } from "react/jsx-runtime";
import { TextInput as RNTextInput } from "react-native";
import { useUniwindAccent } from "../../hooks/index.js";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const TextInput = copyComponentProperties(RNTextInput, (props) => {
  const placeholderTextColor = useUniwindAccent(props.placeholderTextColorClassName);
  return /* @__PURE__ */ jsx(
    RNTextInput,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style],
      placeholderTextColor: props.placeholderTextColor ?? placeholderTextColor
    }
  );
});
export default TextInput;
