import { jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Text as RNText } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const Text = copyComponentProperties(RNText, (props) => {
  const [isPressed, setIsPressed] = useState(false);
  const state = {
    isPressed,
    isDisabled: Boolean(props.disabled)
  };
  const style = useStyle(props.className, props, state);
  const selectionColor = useStyle(props.selectionColorClassName, props, state).accentColor;
  return /* @__PURE__ */ jsx(
    RNText,
    {
      ...props,
      style: [style, props.style],
      selectionColor: props.selectionColor ?? selectionColor,
      numberOfLines: style.WebkitLineClamp ?? props.numberOfLines,
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
export default Text;
