import { jsx } from "react/jsx-runtime";
import { ActivityIndicator as RNActivityIndicator } from "react-native";
import { useUniwindAccent } from "../../hooks/index.js";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const ActivityIndicator = copyComponentProperties(RNActivityIndicator, (props) => {
  const color = useUniwindAccent(props.colorClassName);
  return /* @__PURE__ */ jsx(
    RNActivityIndicator,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style],
      color: props.color ?? color
    }
  );
});
export default ActivityIndicator;
