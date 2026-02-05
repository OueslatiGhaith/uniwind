"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processFunctions = void 0;
const ONE_PX = {
  type: "token",
  value: {
    type: "dimension",
    unit: "px",
    value: 1
  }
};
const processFunctions = exports.processFunctions = {
  pixelRatio: fn => {
    return {
      type: "function",
      value: {
        name: "calc",
        arguments: [fn.arguments.at(0) ?? ONE_PX, {
          type: "token",
          value: {
            type: "delim",
            value: "*"
          }
        }, ONE_PX]
      }
    };
  },
  fontScale: fn => {
    return {
      type: "function",
      value: {
        name: "calc",
        arguments: [fn.arguments.at(0) ?? ONE_PX, {
          type: "token",
          value: {
            type: "delim",
            value: "*"
          }
        }, {
          type: "token",
          value: {
            type: "dimension",
            value: 1,
            unit: "rem"
          }
        }]
      }
    };
  },
  hairlineWidth: () => ONE_PX
};