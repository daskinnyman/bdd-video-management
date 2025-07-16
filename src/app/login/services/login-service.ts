import type { LoginResult } from "../types";

export class MockLoginService {
  async login(email: string, password: string): Promise<LoginResult> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "test@example.com" && password === "password123") {
      return { success: true, message: "登入成功！" };
    } else if (
      email === "invalid@example.com" &&
      password === "wrongpassword"
    ) {
      return { success: false, message: "帳號或密碼錯誤" };
    } else {
      return { success: false, message: "登入失敗，請檢查您的帳號密碼" };
    }
  }
}

export const loginService = new MockLoginService();
