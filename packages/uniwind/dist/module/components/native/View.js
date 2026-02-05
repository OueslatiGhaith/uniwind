import { jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from "react";
import { View as RNView } from "react-native";
import { GroupContext, useGroupContext } from "../../core/native/groupContext.js";
import { HasContext } from "../../core/native/hasContext.js";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const View = copyComponentProperties(RNView, (props) => {
  const [childrenPropsMap, setChildrenPropsMap] = useState(/* @__PURE__ */ new Map());
  const registerChild = useCallback((childProps) => {
    const id = {};
    setChildrenPropsMap((prev) => new Map(prev).set(id, childProps));
    return () => setChildrenPropsMap((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);
  const hasContextValue = useMemo(() => ({ registerChild }), [registerChild]);
  const childrenProps = useMemo(() => Array.from(childrenPropsMap.values()), [childrenPropsMap]);
  const style = useStyle(props.className, props, void 0, childrenProps);
  const parentGroupContext = useGroupContext();
  const groupContext = useMemo(() => {
    const className = props.className;
    if (!className || !className.includes("group") && !className.includes("group/")) {
      return parentGroupContext;
    }
    const nextContext = { ...parentGroupContext };
    const dataAttributes = Object.fromEntries(
      Object.entries(props).filter(([key]) => key.startsWith("data-"))
    );
    className.split(" ").forEach((cls) => {
      if (cls === "group" || cls.startsWith("group/")) {
        nextContext[cls] = [
          ...parentGroupContext[cls] ?? [],
          {
            dataAttributes,
            childrenProps
          }
        ];
      }
    });
    return nextContext;
  }, [props.className, props, parentGroupContext, childrenProps]);
  let content = /* @__PURE__ */ jsx(
    RNView,
    {
      ...props,
      style: [style, props.style]
    }
  );
  const isGroup = props.className?.split(" ").some((cls) => cls === "group" || cls.startsWith("group/"));
  const useHas = props.className?.includes("has-");
  if (isGroup || useHas) {
    content = /* @__PURE__ */ jsx(HasContext.Provider, { value: hasContextValue, children: content });
  }
  if (groupContext !== parentGroupContext) {
    content = /* @__PURE__ */ jsx(GroupContext.Provider, { value: groupContext, children: content });
  }
  return content;
});
export default View;
