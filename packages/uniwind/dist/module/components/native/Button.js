import { jsx } from "react/jsx-runtime";
import { Button as RNButton } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const Button = copyComponentProperties(RNButton, (props) => {
  const color = useStyle(props.colorClassName, props).accentColor;
  return /* @__PURE__ */ jsx(
    RNButton,
    {
      ...props,
      color: props.color ?? color
    }
  );
});
export default Button;
