import { http, HttpResponse } from "msw";
import { mockVideos } from "./mockData";

interface LoginRequest {
  email: string;
  password: string;
}

interface UploadVideoRequest {
  title: string;
  description: string;
  tag: string;
  fileName: string;
  fileSize: number;
}

interface UpdateVideoRequest {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

// 模擬影片資料 - 使用 let 讓它可以被修改
let videos = [...mockVideos];

export const handlers = [
  // 測試 API handler
  http.get("/api/test", () => {
    console.log("MSW test handler called");
    return HttpResponse.json({ message: "MSW is working!" });
  }),

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

  // 上傳影片 API handler
  http.post("/api/upload-video", async ({ request }) => {
    const { title, description, tag, fileName, fileSize } =
      (await request.json()) as UploadVideoRequest;

    // 模擬網路延遲
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 模擬上傳處理邏輯
    console.log("Uploading video:", {
      title,
      description,
      tag,
      fileName,
      fileSize,
    });

    // 模擬成功回應
    return HttpResponse.json({
      success: true,
      message: "Video uploaded successfully",
      videoId: `video_${Date.now()}`,
    });
  }),

  // 獲取影片列表 API handler
  http.get("/api/videos", async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status");

    // 模擬網路延遲
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredVideos = [...videos];

    // 根據狀態篩選
    if (status && status !== "all") {
      filteredVideos = filteredVideos.filter(
        (video) => video.status === status
      );
    }

    // 分頁
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

    console.log("Fetching videos:", {
      page,
      limit,
      status,
      total: filteredVideos.length,
      returned: paginatedVideos.length,
    });

    return HttpResponse.json({
      success: true,
      data: paginatedVideos,
      pagination: {
        page,
        limit,
        total: filteredVideos.length,
        totalPages: Math.ceil(filteredVideos.length / limit),
      },
    });
  }),

  // 更新影片 API handler
  http.put("/api/videos/:id", async ({ request, params }) => {
    const { id } = params;
    const { title, description, tags } =
      (await request.json()) as UpdateVideoRequest;

    // 模擬網路延遲
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 模擬更新邏輯
    console.log("Updating video:", { id, title, description, tags });

    // 檢查影片是否存在
    const videoIndex = videos.findIndex((v) => v.id === id);
    if (videoIndex === -1) {
      return HttpResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      );
    }

    // 更新影片資料
    const updatedVideo = {
      ...videos[videoIndex],
      title,
      description,
      tags,
    };
    videos[videoIndex] = updatedVideo;

    // 模擬成功回應
    return HttpResponse.json({
      success: true,
      message: "Video updated successfully",
      data: updatedVideo,
    });
  }),

  // 刪除影片 API handler
  http.delete("/api/videos/:id", async ({ params }) => {
    const { id } = params;

    // 模擬網路延遲
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 模擬刪除邏輯
    console.log("Deleting video:", { id });

    // 檢查影片是否存在
    const videoIndex = videos.findIndex((v) => v.id === id);
    if (videoIndex === -1) {
      return HttpResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      );
    }

    // 從陣列中移除影片
    videos = videos.filter((v) => v.id !== id);

    // 模擬成功回應
    return HttpResponse.json({
      success: true,
      message: "Video deleted successfully",
    });
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
