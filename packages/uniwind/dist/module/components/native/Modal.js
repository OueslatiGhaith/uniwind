import { jsx } from "react/jsx-runtime";
import { Modal as RNModal } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { useStyle } from "./useStyle.js";
export const Modal = copyComponentProperties(RNModal, (props) => {
  const style = useStyle(props.className, props);
  const backdropColor = useStyle(props.backdropColorClassName, props).accentColor;
  return /* @__PURE__ */ jsx(
    RNModal,
    {
      ...props,
      style: [style, props.style],
      backdropColor: props.backdropColor ?? backdropColor
    }
  );
});
export default Modal;
