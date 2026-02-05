import { jsx } from "react/jsx-runtime";
import { Switch as RNSwitch } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const Switch = copyComponentProperties(RNSwitch, (props) => {
  const state = {
    isDisabled: Boolean(props.disabled)
  };
  const style = useStyle(props.className, props, state);
  const trackColorOn = useStyle(props.trackColorOnClassName, props, state).accentColor;
  const trackColorOff = useStyle(props.trackColorOffClassName, props, state).accentColor;
  const thumbColor = useStyle(props.thumbColorClassName, props, state).accentColor;
  const ios_backgroundColor = useStyle(props.ios_backgroundColorClassName, props, state).accentColor;
  return /* @__PURE__ */ jsx(
    RNSwitch,
    {
      ...props,
      style: [style, props.style],
      thumbColor: props.thumbColor ?? thumbColor,
      trackColor: { true: props.trackColor?.true ?? trackColorOn, false: props.trackColor?.false ?? trackColorOff },
      ios_backgroundColor: props.ios_backgroundColor ?? ios_backgroundColor
    }
  );
});
export default Switch;
