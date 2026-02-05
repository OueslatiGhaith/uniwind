import { useEffect, useRef, useState } from "react";
import { UniwindListener } from "../../core/listener.js";
import { Logger } from "../../core/logger.js";
import { StyleDependency } from "../../types.js";
import { getVariableValue } from "./getVariableValue.js";
const getValue = (name) => Array.isArray(name) ? name.map(getVariableValue) : getVariableValue(name);
const arrayEquals = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
};
let warned = false;
const logDevError = (name) => {
  warned = true;
  Logger.warn(
    `We couldn't find your variable ${name}. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable`
  );
};
export const useCSSVariable = (name) => {
  const [value, setValue] = useState(getValue(name));
  const nameRef = useRef(name);
  useEffect(() => {
    if (Array.isArray(name) && Array.isArray(nameRef.current)) {
      if (arrayEquals(name, nameRef.current)) {
        return;
      }
      setValue(getValue(name));
      nameRef.current = name;
      return;
    }
    if (name !== nameRef.current) {
      setValue(getValue(name));
      nameRef.current = name;
    }
  }, [name]);
  useEffect(() => {
    const updateValue = () => setValue(getValue(nameRef.current));
    const dispose = UniwindListener.subscribe(
      updateValue,
      [StyleDependency.Theme, StyleDependency.Variables]
    );
    return dispose;
  }, []);
  if (Array.isArray(value)) {
    value.forEach((val, index) => {
      if (val === void 0 && __DEV__ && !warned) {
        logDevError(name[index] ?? "");
      }
    });
  }
  if (value === void 0 && __DEV__ && !warned) {
    logDevError(name);
  }
  return value;
};
