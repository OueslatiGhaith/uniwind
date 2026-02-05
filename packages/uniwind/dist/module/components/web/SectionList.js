import { jsx } from "react/jsx-runtime";
import { SectionList as RNSectionList } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const SectionList = copyComponentProperties(RNSectionList, (props) => {
  return /* @__PURE__ */ jsx(
    RNSectionList,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style],
      contentContainerStyle: [toRNWClassName(props.contentContainerClassName), props.contentContainerStyle],
      ListFooterComponentStyle: [toRNWClassName(props.ListFooterComponentClassName), props.ListFooterComponentStyle],
      ListHeaderComponentStyle: [toRNWClassName(props.ListHeaderComponentClassName), props.ListHeaderComponentStyle]
    }
  );
});
export default SectionList;
