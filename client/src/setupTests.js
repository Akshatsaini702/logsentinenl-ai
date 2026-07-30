// jest-dom adds custom jest matchers for asserting on DOM nodes.
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// The jsdom build shipped with react-scripts 5 predates TextEncoder/TextDecoder,
// which react-router v7 requires at import time.
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

// Recharts and the dropzone both observe element size; jsdom has no
// ResizeObserver implementation.
if (typeof global.ResizeObserver === "undefined") {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
