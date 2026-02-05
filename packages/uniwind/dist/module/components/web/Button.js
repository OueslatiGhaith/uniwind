import { jsx } from "react/jsx-runtime";
import { Button as RNButton } from "react-native";
import { useUniwindAccent } from "../../hooks/index.js";
import { copyComponentProperties } from "../utils.js";
export const Button = copyComponentProperties(RNButton, (props) => {
  const color = useUniwindAccent(props.colorClassName);
  return /* @__PURE__ */ jsx(
    RNButton,
    {
      ...props,
      color: props.color ?? color
    }
  );
});
export default Button;
