import { jsx } from "react/jsx-runtime";
import { RefreshControl as RNRefreshControl } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const RefreshControl = copyComponentProperties(RNRefreshControl, (props) => {
  return /* @__PURE__ */ jsx(
    RNRefreshControl,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style]
    }
  );
});
export default RefreshControl;
