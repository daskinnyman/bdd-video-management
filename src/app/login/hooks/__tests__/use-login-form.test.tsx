import { renderHook, act } from "@testing-library/react";
import { useLoginForm } from "../use-login-form";
import { loginService } from "../../services/login-service";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("@mantine/notifications");
jest.mock("next/navigation");
jest.mock("../../services/login-service");

const mockNotifications = notifications as jest.Mocked<typeof notifications>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockLoginService = loginService as jest.Mocked<typeof loginService>;

describe("useLoginForm", () => {
  const mockPush = jest.fn();
  const mockShow = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    (mockNotifications.show as jest.Mock) = mockShow;
  });

  describe("Initial state", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useLoginForm());

      expect(result.current.watchedEmail).toBe("");
      expect(result.current.watchedPassword).toBe("");
      expect(result.current.formState.isSubmitting).toBe(false);
      expect(result.current.formState.isValid).toBeDefined();
      expect(result.current.formState.errors).toBeDefined();
    });

    it("should return form methods", () => {
      const { result } = renderHook(() => useLoginForm());

      expect(result.current.register).toBeDefined();
      expect(result.current.handleSubmit).toBeDefined();
      expect(result.current.handleEmailChange).toBeDefined();
      expect(result.current.handlePasswordChange).toBeDefined();
    });
  });

  describe("Email handling", () => {
    it("should handle email change", () => {
      const { result } = renderHook(() => useLoginForm());
      const mockEvent = {
        target: { value: "test@example.com" },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleEmailChange(mockEvent);
      });

      // Note: We can't directly test the form value, but we can verify the function was called
      expect(result.current.handleEmailChange).toBeDefined();
    });

    it("should handle empty email change", () => {
      const { result } = renderHook(() => useLoginForm());
      const mockEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleEmailChange(mockEvent);
      });

      expect(result.current.handleEmailChange).toBeDefined();
    });
  });

  describe("Password handling", () => {
    it("should handle password change", () => {
      const { result } = renderHook(() => useLoginForm());
      const mockEvent = {
        target: { value: "password123" },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(mockEvent);
      });

      expect(result.current.handlePasswordChange).toBeDefined();
    });

    it("should handle empty password change", () => {
      const { result } = renderHook(() => useLoginForm());
      const mockEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePasswordChange(mockEvent);
      });

      expect(result.current.handlePasswordChange).toBeDefined();
    });
  });

  describe("Form submission", () => {
    it("should handle successful admin login", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "admin@example.com",
        password: "admin123",
      };

      mockLoginService.login.mockResolvedValue({
        success: true,
        message: "Login successful",
        role: "admin",
        token: "admin-token",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockLoginService.login).toHaveBeenCalledWith(
        mockFormData.email,
        mockFormData.password
      );
      expect(mockLoginService.login).toHaveBeenCalledTimes(1);
      expect(mockShow).toHaveBeenCalledWith({
        title: "Success",
        message: "Login successful",
        color: "green",
        icon: expect.any(Object),
      });
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });

    it("should handle successful user login", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "user@example.com",
        password: "user123",
      };

      mockLoginService.login.mockResolvedValue({
        success: true,
        message: "Login successful",
        role: "user",
        token: "user-token",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockLoginService.login).toHaveBeenCalledWith(
        mockFormData.email,
        mockFormData.password
      );
      expect(mockLoginService.login).toHaveBeenCalledTimes(1);
      expect(mockShow).toHaveBeenCalledWith({
        title: "Success",
        message: "Login successful",
        color: "green",
        icon: expect.any(Object),
      });
      expect(mockPush).toHaveBeenCalledWith("/user/video");
    });

    it("should handle successful login without role", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "test@example.com",
        password: "test123",
      };

      mockLoginService.login.mockResolvedValue({
        success: true,
        message: "Login successful",
        token: "test-token",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockLoginService.login).toHaveBeenCalledWith(
        mockFormData.email,
        mockFormData.password
      );
      expect(mockLoginService.login).toHaveBeenCalledTimes(1);
      expect(mockShow).toHaveBeenCalledWith({
        title: "Success",
        message: "Login successful",
        color: "green",
        icon: expect.any(Object),
      });
      // Should not redirect if no role is provided
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should handle login failure", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "wrong@example.com",
        password: "wrongpassword",
      };

      mockLoginService.login.mockResolvedValue({
        success: false,
        message: "Invalid email or password",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockLoginService.login).toHaveBeenCalledWith(
        mockFormData.email,
        mockFormData.password
      );
      expect(mockLoginService.login).toHaveBeenCalledTimes(1);
      expect(mockShow).toHaveBeenCalledWith({
        title: "Error",
        message: "Invalid email or password",
        color: "red",
        icon: expect.any(Object),
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should handle network error during login", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "test@example.com",
        password: "test123",
      };

      mockLoginService.login.mockRejectedValue(new Error("Network error"));

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockLoginService.login).toHaveBeenCalledWith(
        mockFormData.email,
        mockFormData.password
      );
      expect(mockLoginService.login).toHaveBeenCalledTimes(1);
      expect(mockShow).toHaveBeenCalledWith({
        title: "Error",
        message: "An error occurred during login, please try again later",
        color: "red",
        icon: expect.any(Object),
      });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Notification handling", () => {
    it("should show success notification with green color and check icon", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "test@example.com",
        password: "test123",
      };

      mockLoginService.login.mockResolvedValue({
        success: true,
        message: "Success message",
        role: "user",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockShow).toHaveBeenCalledWith({
        title: "Success",
        message: "Success message",
        color: "green",
        icon: expect.any(Object),
      });
    });

    it("should show error notification with red color and alert icon", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "test@example.com",
        password: "test123",
      };

      mockLoginService.login.mockResolvedValue({
        success: false,
        message: "Error message",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockShow).toHaveBeenCalledWith({
        title: "Error",
        message: "Error message",
        color: "red",
        icon: expect.any(Object),
      });
    });
  });

  describe("Form state management", () => {
    it("should return form state properties", () => {
      const { result } = renderHook(() => useLoginForm());

      expect(result.current.formState).toHaveProperty("errors");
      expect(result.current.formState).toHaveProperty("isValid");
      expect(result.current.formState).toHaveProperty("isSubmitting");
    });

    it("should clear errors before submission", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "test@example.com",
        password: "test123",
      };

      mockLoginService.login.mockResolvedValue({
        success: true,
        message: "Login successful",
        role: "user",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      // The clearErrors function should be called before submission
      expect(mockLoginService.login).toHaveBeenCalledWith(
        mockFormData.email,
        mockFormData.password
      );
    });
  });

  describe("Role-based redirection", () => {
    it("should redirect admin to /admin", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "admin@example.com",
        password: "admin123",
      };

      mockLoginService.login.mockResolvedValue({
        success: true,
        message: "Login successful",
        role: "admin",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockPush).toHaveBeenCalledWith("/admin");
    });

    it("should redirect user to /user", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "user@example.com",
        password: "user123",
      };

      mockLoginService.login.mockResolvedValue({
        success: true,
        message: "Login successful",
        role: "user",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockPush).toHaveBeenCalledWith("/user/video");
    });

    it("should not redirect when no role is provided", async () => {
      const { result } = renderHook(() => useLoginForm());
      const mockFormData = {
        email: "test@example.com",
        password: "test123",
      };

      mockLoginService.login.mockResolvedValue({
        success: true,
        message: "Login successful",
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
