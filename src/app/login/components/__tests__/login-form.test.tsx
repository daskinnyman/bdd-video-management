/// <reference types="@testing-library/jest-dom" />

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { LoginForm } from "../login-form";
import { fireEvent } from "@testing-library/react";

// Mock react-hook-form
const mockRegister = jest.fn();
const mockOnSubmit = jest.fn(async () => {});
const mockOnEmailChange = jest.fn();
const mockOnPasswordChange = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockForm = (overrides: any = {}) => ({
  register: mockRegister,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: (onValid: any) => (e: React.FormEvent) => {
    e.preventDefault();
    return onValid({
      email: "test@example.com",
      password: "password123",
    });
  },
  formState: {
    errors: {},
    isValid: true,
    isSubmitting: false,
    ...overrides.formState,
  },
  ...overrides,
});

const defaultProps = {
  form: createMockForm(),
  watchedEmail: "",
  watchedPassword: "",
  onSubmit: mockOnSubmit,
  onEmailChange: mockOnEmailChange,
  onPasswordChange: mockOnPasswordChange,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Create test wrapper function
const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Valid input cases", () => {
    it("should render form components correctly", () => {
      renderWithMantine(<LoginForm {...defaultProps} />);

      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("password-input")).toBeInTheDocument();
      expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    it("should enable login button when valid data is entered", () => {
      const props = {
        ...defaultProps,
        watchedEmail: "test@example.com",
        watchedPassword: "password123",
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).not.toBeDisabled();
    });

    it("should call onSubmit function when submitted", async () => {
      const localMockOnSubmit = jest.fn(async () => {});
      const props = {
        ...defaultProps,
        onSubmit: localMockOnSubmit,
      };
      renderWithMantine(<LoginForm {...props} />);
      const form = screen.getByTestId("login-form");
      fireEvent.submit(form);
      // Wait for Promise to resolve
      await new Promise((r) => setTimeout(r, 0));
      expect(localMockOnSubmit).toHaveBeenCalled();
    });

    it("should call corresponding onChange functions when input changes", async () => {
      const user = userEvent.setup();
      renderWithMantine(<LoginForm {...defaultProps} />);

      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      expect(mockOnEmailChange).toHaveBeenCalled();
      expect(mockOnPasswordChange).toHaveBeenCalled();
    });
  });

  describe("Invalid input cases", () => {
    it("should display email format error", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              email: { message: "Please enter a valid email format" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      expect(
        screen.getByText("Please enter a valid email format")
      ).toBeInTheDocument();
    });

    it("should display password length error", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              password: { message: "Password must be at least 6 characters" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      expect(
        screen.getByText("Password must be at least 6 characters")
      ).toBeInTheDocument();
    });

    it("should display root error message", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              root: { message: "Invalid username or password" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(
        screen.getByText("Invalid username or password")
      ).toBeInTheDocument();
    });

    it("should disable login button when form is invalid", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {},
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toBeDisabled();
    });
  });

  describe("Edge cases", () => {
    it("should show loading state when submitting", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {},
            isValid: true,
            isSubmitting: true,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toHaveTextContent("Logging in...");
      expect(loginButton).toBeDisabled();
    });

    it("should disable login button when email is empty", () => {
      const props = {
        ...defaultProps,
        watchedEmail: "",
        watchedPassword: "password123",
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toBeDisabled();
    });

    it("should disable login button when password is empty", () => {
      const props = {
        ...defaultProps,
        watchedEmail: "test@example.com",
        watchedPassword: "",
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toBeDisabled();
    });

    it("should disable login button when both fields are empty", () => {
      const props = {
        ...defaultProps,
        watchedEmail: "",
        watchedPassword: "",
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toBeDisabled();
    });

    it("should handle multiple errors simultaneously", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              email: { message: "Please enter your email" },
              password: { message: "Please enter your password" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      expect(screen.getByText("Please enter your email")).toBeInTheDocument();
      expect(
        screen.getByText("Please enter your password")
      ).toBeInTheDocument();
    });

    it("should disable login button when form is invalid and there is input value", () => {
      const props = {
        ...defaultProps,
        watchedEmail: "test@example.com",
        watchedPassword: "password123",
        form: createMockForm({
          formState: {
            errors: {},
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toBeDisabled();
    });
  });

  describe("Form validation", () => {
    it("should correctly register email field", () => {
      renderWithMantine(<LoginForm {...defaultProps} />);

      expect(mockRegister).toHaveBeenCalledWith("email", {
        required: "Please enter your email",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Please enter a valid email format",
        },
      });
    });

    it("should correctly register password field", () => {
      renderWithMantine(<LoginForm {...defaultProps} />);

      expect(mockRegister).toHaveBeenCalledWith("password", {
        required: "Please enter your password",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      });
    });
  });
});
