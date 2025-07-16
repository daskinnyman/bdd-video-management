import { http, HttpResponse } from "msw";

interface LoginRequest {
  email: string;
  password: string;
}

export const handlers = [
  // 登入 API handler
  http.post("/api/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;

    // 模擬網路延遲
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 驗證邏輯
    if (email === "test@example.com" && password === "password123") {
      return HttpResponse.json({
        success: true,
        message: "Login successful!",
        role: "user",
        token: "mock-user-token-123",
      });
    }

    if (email === "admin@example.com" && password === "admin123") {
      return HttpResponse.json({
        success: true,
        message: "Login successful!",
        role: "admin",
        token: "mock-admin-token-456",
      });
    }

    if (email === "invalid@example.com" && password === "wrongpassword") {
      return HttpResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    // 預設錯誤回應
    return HttpResponse.json(
      {
        success: false,
        message: "Login failed, please check your credentials",
      },
      { status: 400 }
    );
  }),

  // 使用者資訊 API handler
  http.get("/api/user/profile", () => {
    return HttpResponse.json({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      role: "user",
    });
  }),

  // 管理員資訊 API handler
  http.get("/api/admin/profile", () => {
    return HttpResponse.json({
      id: 2,
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
    });
  }),
];
