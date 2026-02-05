import { jsx } from "react/jsx-runtime";
import { InputAccessoryView as RNInputAccessoryView } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const InputAccessoryView = copyComponentProperties(
  RNInputAccessoryView,
  (props) => {
    const style = useStyle(props.className, props);
    const backgroundColor = useStyle(props.backgroundColorClassName, props).accentColor;
    return /* @__PURE__ */ jsx(
      RNInputAccessoryView,
      {
        ...props,
        backgroundColor: props.backgroundColor ?? backgroundColor,
        style: [style, props.style]
      }
    );
  }
);
export default InputAccessoryView;
