import { jsx } from "react/jsx-runtime";
import { ActivityIndicator as RNActivityIndicator } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const ActivityIndicator = copyComponentProperties(RNActivityIndicator, (props) => {
  const style = useStyle(props.className, props);
  const color = useStyle(props.colorClassName, props).accentColor;
  return /* @__PURE__ */ jsx(
    RNActivityIndicator,
    {
      ...props,
      style: [style, props.style],
      color: props.color ?? color
    }
  );
});
export default ActivityIndicator;
