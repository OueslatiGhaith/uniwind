import { jsx } from "react/jsx-runtime";
import { Switch as RNSwitch } from "react-native";
import { useUniwindAccent } from "../../hooks/index.js";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const Switch = copyComponentProperties(RNSwitch, (props) => {
  const trackColorOn = useUniwindAccent(props.trackColorOnClassName);
  const trackColorOff = useUniwindAccent(props.trackColorOffClassName);
  const thumbColor = useUniwindAccent(props.thumbColorClassName);
  return /* @__PURE__ */ jsx(
    RNSwitch,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style],
      thumbColor: props.thumbColor ?? thumbColor,
      trackColor: { true: props.trackColor?.true ?? trackColorOn, false: props.trackColor?.false ?? trackColorOff }
    }
  );
});
export default Switch;
