import { jsx } from "react/jsx-runtime";
import { FlatList as RNFlatList } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const FlatList = copyComponentProperties(RNFlatList, (props) => {
  const style = useStyle(props.className, props);
  const styleColumnWrapper = useStyle(props.columnWrapperClassName, props);
  const styleContentContainer = useStyle(props.contentContainerClassName, props);
  const styleListFooterComponent = useStyle(props.ListFooterComponentClassName, props);
  const styleListHeaderComponent = useStyle(props.ListHeaderComponentClassName, props);
  const endFillColor = useStyle(props.endFillColorClassName, props).accentColor;
  const hasSingleColumn = !("numColumns" in props) || props.numColumns === 1;
  return /* @__PURE__ */ jsx(
    RNFlatList,
    {
      ...props,
      style: [style, props.style],
      columnWrapperStyle: hasSingleColumn ? void 0 : [styleColumnWrapper, props.columnWrapperStyle],
      contentContainerStyle: [styleContentContainer, props.contentContainerStyle],
      ListFooterComponentStyle: [styleListFooterComponent, props.ListFooterComponentStyle],
      ListHeaderComponentStyle: [styleListHeaderComponent, props.ListHeaderComponentStyle],
      endFillColor: props.endFillColor ?? endFillColor
    }
  );
});
export default FlatList;
