import { jsx } from "react/jsx-runtime";
import { VirtualizedList as RNVirtualizedList } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const VirtualizedList = copyComponentProperties(RNVirtualizedList, (props) => {
  const style = useStyle(props.className, props);
  const contentContainerStyle = useStyle(props.contentContainerClassName, props);
  const listFooterComponentStyle = useStyle(props.ListFooterComponentClassName, props);
  const listHeaderComponentStyle = useStyle(props.ListHeaderComponentClassName, props);
  const endFillColor = useStyle(props.endFillColorClassName, props).accentColor;
  return /* @__PURE__ */ jsx(
    RNVirtualizedList,
    {
      ...props,
      style: [style, props.style],
      contentContainerStyle: [contentContainerStyle, props.contentContainerStyle],
      ListFooterComponentStyle: [listFooterComponentStyle, props.ListFooterComponentStyle],
      ListHeaderComponentStyle: [listHeaderComponentStyle, props.ListHeaderComponentStyle],
      endFillColor: props.endFillColor ?? endFillColor
    }
  );
});
export default VirtualizedList;
