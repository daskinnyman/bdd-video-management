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

// 創建測試用的 wrapper 函數
const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("正確輸入的 case", () => {
    it("應該正確渲染表單元件", () => {
      renderWithMantine(<LoginForm {...defaultProps} />);

      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("password-input")).toBeInTheDocument();
      expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    it("應該在輸入有效資料時啟用登入按鈕", () => {
      const props = {
        ...defaultProps,
        watchedEmail: "test@example.com",
        watchedPassword: "password123",
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).not.toBeDisabled();
    });

    it("應該在提交時呼叫 onSubmit 函式", async () => {
      const localMockOnSubmit = jest.fn(async () => {});
      const props = {
        ...defaultProps,
        onSubmit: localMockOnSubmit,
      };
      renderWithMantine(<LoginForm {...props} />);
      const form = screen.getByTestId("login-form");
      fireEvent.submit(form);
      // 等待 Promise resolve
      await new Promise((r) => setTimeout(r, 0));
      expect(localMockOnSubmit).toHaveBeenCalled();
    });

    it("應該在輸入變更時呼叫對應的 onChange 函式", async () => {
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

  describe("錯誤輸入的 case", () => {
    it("應該顯示電子郵件格式錯誤", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              email: { message: "請輸入有效的電子郵件格式" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      expect(screen.getByText("請輸入有效的電子郵件格式")).toBeInTheDocument();
    });

    it("應該顯示密碼長度錯誤", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              password: { message: "密碼至少需要 6 個字元" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      expect(screen.getByText("密碼至少需要 6 個字元")).toBeInTheDocument();
    });

    it("應該顯示根錯誤訊息", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              root: { message: "帳號或密碼錯誤" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText("帳號或密碼錯誤")).toBeInTheDocument();
    });

    it("應該在表單無效時禁用登入按鈕", () => {
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

  describe("邊界情況的 case", () => {
    it("應該在提交中時顯示載入狀態", () => {
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
      expect(loginButton).toHaveTextContent("登入中...");
      expect(loginButton).toBeDisabled();
    });

    it("應該在電子郵件為空時禁用登入按鈕", () => {
      const props = {
        ...defaultProps,
        watchedEmail: "",
        watchedPassword: "password123",
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toBeDisabled();
    });

    it("應該在密碼為空時禁用登入按鈕", () => {
      const props = {
        ...defaultProps,
        watchedEmail: "test@example.com",
        watchedPassword: "",
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toBeDisabled();
    });

    it("應該在兩個欄位都為空時禁用登入按鈕", () => {
      const props = {
        ...defaultProps,
        watchedEmail: "",
        watchedPassword: "",
      };

      renderWithMantine(<LoginForm {...props} />);

      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toBeDisabled();
    });

    it("應該正確處理多個錯誤同時存在的情況", () => {
      const props = {
        ...defaultProps,
        form: createMockForm({
          formState: {
            errors: {
              email: { message: "請輸入電子郵件" },
              password: { message: "請輸入密碼" },
            },
            isValid: false,
            isSubmitting: false,
          },
        }),
      };

      renderWithMantine(<LoginForm {...props} />);

      expect(screen.getByText("請輸入電子郵件")).toBeInTheDocument();
      expect(screen.getByText("請輸入密碼")).toBeInTheDocument();
    });

    it("應該在表單無效且有輸入值時禁用登入按鈕", () => {
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

  describe("表單驗證", () => {
    it("應該正確註冊電子郵件欄位", () => {
      renderWithMantine(<LoginForm {...defaultProps} />);

      expect(mockRegister).toHaveBeenCalledWith("email", {
        required: "請輸入電子郵件",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "請輸入有效的電子郵件格式",
        },
      });
    });

    it("應該正確註冊密碼欄位", () => {
      renderWithMantine(<LoginForm {...defaultProps} />);

      expect(mockRegister).toHaveBeenCalledWith("password", {
        required: "請輸入密碼",
        minLength: {
          value: 6,
          message: "密碼至少需要 6 個字元",
        },
      });
    });
  });
});
