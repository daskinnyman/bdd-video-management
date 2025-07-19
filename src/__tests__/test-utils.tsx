import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockForward = jest.fn();
const mockRefresh = jest.fn();
const mockPrefetch = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    prefetch: mockPrefetch,
  }),
}));

// Mock notifications
jest.mock("@mantine/notifications", () => ({
  Notifications: () => null,
  notifications: {
    show: jest.fn(),
  },
}));

// Mock fetch API
global.fetch = jest.fn();

// Export mock functions for use in tests
export const mockRouter = {
  push: mockPush,
  replace: mockReplace,
  back: mockBack,
  forward: mockForward,
  refresh: mockRefresh,
  prefetch: mockPrefetch,
};

export const mockFetch = jest.mocked(fetch);

// Test wrapper component with MantineProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>
    <div data-testid="test-wrapper">{children}</div>
  </MantineProvider>
);

// Custom render function that includes the TestWrapper
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(ui, { wrapper: TestWrapper, ...options });
};

// Clear all mocks function
export const clearAllMocks = () => {
  jest.clearAllMocks();
  mockPush.mockClear();
  mockReplace.mockClear();
  mockBack.mockClear();
  mockForward.mockClear();
  mockRefresh.mockClear();
  mockPrefetch.mockClear();
  mockFetch.mockClear();
};

// Export everything
export * from "@testing-library/react";
export { customRender as render, TestWrapper };
