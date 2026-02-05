import { jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from "react";
import { Pressable as RNPressable } from "react-native";
import { UniwindStore } from "../../core/native/index.js";
import { GroupContext, useGroupContext } from "../../core/native/groupContext.js";
import { HasContext } from "../../core/native/hasContext.js";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const Pressable = copyComponentProperties(RNPressable, (props) => {
  const [isPressed, setIsPressed] = useState(false);
  const [childrenPropsMap, setChildrenPropsMap] = useState(/* @__PURE__ */ new Map());
  const parentGroupContext = useGroupContext();
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
  const style = useStyle(
    props.className,
    props,
    {
      isDisabled: Boolean(props.disabled),
      isPressed
    },
    childrenProps
  );
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
            isPressed,
            isFocused: false,
            isDisabled: Boolean(props.disabled),
            childrenProps
          }
        ];
      }
    });
    return nextContext;
  }, [props.className, props, parentGroupContext, isPressed, childrenProps]);
  let content = /* @__PURE__ */ jsx(
    RNPressable,
    {
      ...props,
      onPressIn: (e) => {
        setIsPressed(true);
        props.onPressIn?.(e);
      },
      onPressOut: (e) => {
        setIsPressed(false);
        props.onPressOut?.(e);
      },
      style: (state) => {
        const currentStyle = isPressed ? UniwindStore.getStyles(
          props.className,
          props,
          {
            isDisabled: Boolean(props.disabled),
            isPressed: state.pressed || isPressed
          },
          parentGroupContext,
          childrenProps
        ).styles : style;
        return [currentStyle, typeof props.style === "function" ? props.style(state) : props.style];
      }
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
export default Pressable;
