import "@testing-library/jest-dom";

// Mock CSS modules
jest.mock("*.module.css", () => ({}));
jest.mock("*.module.scss", () => ({}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo for table testing
Element.prototype.scrollTo = jest.fn();

// Mock getBoundingClientRect for virtualized table testing
Element.prototype.getBoundingClientRect = jest.fn(
  () =>
    ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)
);

// Mock clientWidth and clientHeight for table container testing
Object.defineProperty(Element.prototype, "clientWidth", {
  writable: true,
  value: 800,
});

Object.defineProperty(Element.prototype, "clientHeight", {
  writable: true,
  value: 600,
});

// Mock scrollHeight and scrollTop for table scrolling testing
Object.defineProperty(Element.prototype, "scrollHeight", {
  writable: true,
  value: 1000,
});

Object.defineProperty(Element.prototype, "scrollTop", {
  writable: true,
  value: 0,
});

// 暫時移除 MSW 設定，因為在 Jest 環境中有相容性問題
// 我們將在測試中直接 mock fetch API
