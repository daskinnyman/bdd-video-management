import type { LoginResult } from "../types";

export class LoginService {
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }

      return {
        success: data.success,
        message: data.message,
        role: data.role,
        token: data.token,
      };
    } catch {
      return {
        success: false,
        message: "Network error occurred",
      };
    }
  }
}

export const loginService = new LoginService();
