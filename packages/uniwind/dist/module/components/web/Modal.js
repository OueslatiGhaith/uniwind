import { jsx } from "react/jsx-runtime";
import { Modal as RNModal } from "react-native";
import { copyComponentProperties } from "../utils.js";
import { toRNWClassName } from "./rnw.js";
export const Modal = copyComponentProperties(RNModal, (props) => {
  return /* @__PURE__ */ jsx(
    RNModal,
    {
      ...props,
      style: [toRNWClassName(props.className), props.style]
    }
  );
});
export default Modal;
