"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overwrite = void 0;
const overwriteDisabled = `@custom-variant disabled {
    &:disabled {
        @slot;
    }

    &[aria-disabled="true"] {
        @slot;
    }

    &[readonly] {
        @slot;
    }
}
`;
const overwrite = exports.overwrite = overwriteDisabled;