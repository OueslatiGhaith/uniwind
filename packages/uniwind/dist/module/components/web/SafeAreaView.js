import { jsx } from "react/jsx-runtime";
import { SafeAreaView as RNSafeAreaView } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const SafeAreaView = copyComponentProperties(RNSafeAreaView, (props) => {
  return /* @__PURE__ */ jsx(
    RNSafeAreaView,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style]
    }
  );
});
export default SafeAreaView;
