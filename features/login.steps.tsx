import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import LoginPage from "../src/app/login/components/LoginPage";
import React from "react";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock the login service first
jest.mock("../src/app/login/services/login-service", () => ({
  loginService: {
    login: jest.fn(),
  },
}));

// Mock notifications
jest.mock("@mantine/notifications", () => ({
  Notifications: () => null,
  notifications: {
    show: jest.fn(),
  },
}));

// Load the feature file
const feature = loadFeature("./features/login.feature");

// Get the mocked function after mock is defined
import { loginService } from "../src/app/login/services/login-service";
import { notifications } from "@mantine/notifications";
const mockLogin = jest.mocked(loginService.login);
const mockNotifications = jest.mocked(notifications);

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>
    <Notifications />
    {children}
  </MantineProvider>
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockLogin.mockImplementation(async (email: string, password: string) => {
      if (email === "test@example.com" && password === "password123") {
        return { success: true, message: "Login successful!", role: "user" };
      } else if (email === "admin@example.com" && password === "admin123") {
        return { success: true, message: "Login successful!", role: "admin" };
      } else if (
        email === "invalid@example.com" &&
        password === "wrongpassword"
      ) {
        return { success: false, message: "Invalid username or password" };
      } else {
        return {
          success: false,
          message: "Login failed, please check your credentials",
        };
      }
    });
  });

  test("Login with valid credentials", ({ given, when, then }) => {
    given("I am on the login page", () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );
    });

    when("I enter valid credentials", async () => {
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");
    });

    then("I click the login button", async () => {
      const loginButton = screen.getByTestId("login-button");
      await userEvent.click(loginButton);
    });

    then("I should see a success message", async () => {
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "test@example.com",
          "password123"
        );
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(mockNotifications.show).toHaveBeenCalledWith({
          title: "Success",
          message: "Login successful!",
          color: "green",
          icon: expect.anything(),
        });
      });
    });
  });

  test("Login with invalid credentials", ({ given, when, then }) => {
    given("I am on the login page", () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );
    });

    when("I enter invalid credentials", async () => {
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      await userEvent.type(emailInput, "invalid@example.com");
      await userEvent.type(passwordInput, "wrongpassword");
    });

    then("I click the login button", async () => {
      const loginButton = screen.getByTestId("login-button");
      await userEvent.click(loginButton);
    });

    then("I should see an error message on the form", async () => {
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "invalid@example.com",
          "wrongpassword"
        );
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(mockNotifications.show).toHaveBeenCalledWith({
          title: "Error",
          message: "Invalid username or password",
          color: "red",
          icon: expect.anything(),
        });
      });
    });
  });

  test("Login with empty credentials", ({ given, when, then }) => {
    given("I am on the login page", () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );
    });

    when("I enter empty credentials", async () => {
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);
    });

    then("the login button should be disabled", () => {
      const loginButton = screen.getByTestId("login-button");
      expect(loginButton).toBeDisabled();
    });
  });

  test("Login with invalid email", ({ given, when, then }) => {
    given("I am on the login page", () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );
    });

    when("I enter an invalid email", async () => {
      const emailInput = screen.getByTestId("email-input");
      await userEvent.type(emailInput, "invalid-email");
    });

    then("I click the login button", async () => {
      const loginButton = screen.getByTestId("login-button");
      await userEvent.click(loginButton);
    });

    then("I should see an error message on the field that is not valid", () => {
      expect(
        screen.getByText("Please enter a valid email format")
      ).toBeInTheDocument();
    });
  });

  test("Login with invalid password", ({ given, when, then }) => {
    given("I am on the login page", () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );
    });

    when("I enter an invalid password", async () => {
      const passwordInput = screen.getByTestId("password-input");
      await userEvent.type(passwordInput, "123"); // Password too short
    });

    then("I click the login button", async () => {
      const loginButton = screen.getByTestId("login-button");
      await userEvent.click(loginButton);
    });

    then("I should see an error message on the field that is not valid", () => {
      expect(
        screen.getByText("Password must be at least 6 characters")
      ).toBeInTheDocument();
    });
  });

  test("Login with admin account", ({ given, when, then }) => {
    given("I am on the login page", () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );
    });

    when("I enter admin credentials", async () => {
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      await userEvent.type(emailInput, "admin@example.com");
      await userEvent.type(passwordInput, "admin123");
    });

    then("I click the login button", async () => {
      const loginButton = screen.getByTestId("login-button");
      await userEvent.click(loginButton);
    });

    then("I should see a admin dashboard", async () => {
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("admin@example.com", "admin123");
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(mockNotifications.show).toHaveBeenCalledWith({
          title: "Success",
          message: "Login successful!",
          color: "green",
          icon: expect.anything(),
        });
        // 驗證是否導向到 admin dashboard
        expect(mockPush).toHaveBeenCalledWith("/admin");
      });
    });
  });

  test("Login with user account", ({ given, when, then }) => {
    given("I am on the login page", () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );
    });

    when("I enter user credentials", async () => {
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");
    });

    then("I click the login button", async () => {
      const loginButton = screen.getByTestId("login-button");
      await userEvent.click(loginButton);
    });

    then("I should see a user page", async () => {
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "test@example.com",
          "password123"
        );
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(mockNotifications.show).toHaveBeenCalledWith({
          title: "Success",
          message: "Login successful!",
          color: "green",
          icon: expect.anything(),
        });
        // 驗證是否導向到 user page
        expect(mockPush).toHaveBeenCalledWith("/user");
      });
    });
  });
});
