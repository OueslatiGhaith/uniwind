import { jsx } from "react/jsx-runtime";
import { useState } from "react";
import { TouchableHighlight as RNTouchableHighlight } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const TouchableHighlight = copyComponentProperties(RNTouchableHighlight, (props) => {
  const [isPressed, setIsPressed] = useState(false);
  const state = {
    isDisabled: Boolean(props.disabled),
    isPressed
  };
  const style = useStyle(props.className, props, state);
  const underlayColor = useStyle(props.underlayColorClassName, props, state).accentColor;
  return /* @__PURE__ */ jsx(
    RNTouchableHighlight,
    {
      ...props,
      style: [style, props.style],
      underlayColor: props.underlayColor ?? underlayColor,
      onPressIn: (event) => {
        setIsPressed(true);
        props.onPressIn?.(event);
      },
      onPressOut: (event) => {
        setIsPressed(false);
        props.onPressOut?.(event);
      }
    }
  );
});
export default TouchableHighlight;
