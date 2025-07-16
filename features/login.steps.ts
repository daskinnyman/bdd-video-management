import { defineFeature, loadFeature } from "jest-cucumber";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";

// // Mock functions
// const mockLogin = jest.fn();
// const mockValidateEmail = jest.fn();
// const mockValidatePassword = jest.fn();

// Load the feature file
const feature = loadFeature("./features/login.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Login with valid credentials", ({ given, when, then }) => {
    given("I am on the login page", () => {
      // TODO: 實作頁面渲染邏輯
      // render(<LoginPage />);
    });

    when("I enter valid credentials", async () => {
      // TODO: 實作輸入有效帳密邏輯
      // const emailInput = screen.getByTestId('email-input');
      // const passwordInput = screen.getByTestId('password-input');
      // await userEvent.type(emailInput, 'test@example.com');
      // await userEvent.type(passwordInput, 'password123');
    });

    then("I click the login button", async () => {
      // TODO: 實作點擊登入按鈕邏輯
      // const loginButton = screen.getByTestId('login-button');
      // await userEvent.click(loginButton);
    });

    then("I should see a success message", () => {
      // TODO: 實作驗證成功訊息邏輯
      // expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      // expect(mockLogin).toHaveBeenCalledTimes(1);
      // expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });

  test("Login with invalid credentials", ({ given, when, then }) => {
    given("I am on the login page", () => {
      // TODO: 實作頁面渲染邏輯
      // render(<LoginPage />);
    });

    when("I enter invalid credentials", async () => {
      // TODO: 實作輸入無效帳密邏輯
      // const emailInput = screen.getByTestId('email-input');
      // const passwordInput = screen.getByTestId('password-input');
      // await userEvent.type(emailInput, 'invalid@example.com');
      // await userEvent.type(passwordInput, 'wrongpassword');
    });

    then("I click the login button", async () => {
      // TODO: 實作點擊登入按鈕邏輯
      // const loginButton = screen.getByTestId('login-button');
      // await userEvent.click(loginButton);
    });

    then("I should see an error message on the form", () => {
      // TODO: 實作驗證錯誤訊息邏輯
      // expect(mockLogin).toHaveBeenCalledWith('invalid@example.com', 'wrongpassword');
      // expect(mockLogin).toHaveBeenCalledTimes(1);
      // expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  test("Login with empty credentials", ({ given, when, then }) => {
    given("I am on the login page", () => {
      // TODO: 實作頁面渲染邏輯
      // render(<LoginPage />);
    });

    when("I enter empty credentials", async () => {
      // TODO: 實作輸入空值邏輯
      // const emailInput = screen.getByTestId('email-input');
      // const passwordInput = screen.getByTestId('password-input');
      // await userEvent.clear(emailInput);
      // await userEvent.clear(passwordInput);
    });

    then("the login button should be disabled", () => {
      // TODO: 實作驗證按鈕禁用邏輯
      // const loginButton = screen.getByTestId('login-button');
      // expect(loginButton).toBeDisabled();
    });
  });

  test("Login with invalid email", ({ given, when, then }) => {
    given("I am on the login page", () => {
      // TODO: 實作頁面渲染邏輯
      // render(<LoginPage />);
    });

    when("I enter an invalid email", async () => {
      // TODO: 實作輸入無效 email 邏輯
      // const emailInput = screen.getByTestId('email-input');
      // await userEvent.type(emailInput, 'invalid-email');
    });

    then("I click the login button", async () => {
      // TODO: 實作點擊登入按鈕邏輯
      // const loginButton = screen.getByTestId('login-button');
      // await userEvent.click(loginButton);
    });

    then("I should see an error message on the field that is not valid", () => {
      // TODO: 實作驗證 email 欄位錯誤訊息邏輯
      // expect(mockValidateEmail).toHaveBeenCalledWith('invalid-email');
      // expect(mockValidateEmail).toHaveBeenCalledTimes(1);
      // expect(screen.getByTestId('email-error-message')).toBeInTheDocument();
    });
  });

  test("Login with invalid password", ({ given, when, then }) => {
    given("I am on the login page", () => {
      // TODO: 實作頁面渲染邏輯
      // render(<LoginPage />);
    });

    when("I enter an invalid password", async () => {
      // TODO: 實作輸入無效密碼邏輯
      // const passwordInput = screen.getByTestId('password-input');
      // await userEvent.type(passwordInput, '123'); // 太短的密碼
    });

    then("I click the login button", async () => {
      // TODO: 實作點擊登入按鈕邏輯
      // const loginButton = screen.getByTestId('login-button');
      // await userEvent.click(loginButton);
    });

    then("I should see an error message on the field that is not valid", () => {
      // TODO: 實作驗證密碼欄位錯誤訊息邏輯
      // expect(mockValidatePassword).toHaveBeenCalledWith('123');
      // expect(mockValidatePassword).toHaveBeenCalledTimes(1);
      // expect(screen.getByTestId('password-error-message')).toBeInTheDocument();
    });
  });
});
