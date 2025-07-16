import type { LoginResult } from "../types";

export class MockLoginService {
  async login(email: string, password: string): Promise<LoginResult> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "test@example.com" && password === "password123") {
      return { success: true, message: "Login successful!" };
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
  }
}

export const loginService = new MockLoginService();
