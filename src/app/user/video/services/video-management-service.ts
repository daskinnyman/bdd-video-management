import type { Video } from "../mock-data";

export interface VideoListResponse {
  success: boolean;
  data: Video[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateVideoRequest {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface UpdateVideoResponse {
  success: boolean;
  message: string;
  data?: Video;
}

export interface DeleteVideoResponse {
  success: boolean;
  message: string;
}

export class VideoManagementService {
  // 獲取影片列表
  async getVideos(params: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<VideoListResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.status) searchParams.append("status", params.status);

      const response = await fetch(`/api/videos?${searchParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch videos");
      }

      return data;
    } catch {
      throw new Error("Network error occurred");
    }
  }

  // 更新影片
  async updateVideo(request: UpdateVideoRequest): Promise<UpdateVideoResponse> {
    try {
      const response = await fetch(`/api/videos/${request.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: request.title,
          description: request.description,
          tags: request.tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update video",
        };
      }

      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch {
      return {
        success: false,
        message: "Network error occurred",
      };
    }
  }

  // 刪除影片
  async deleteVideo(videoId: string): Promise<DeleteVideoResponse> {
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to delete video",
        };
      }

      return {
        success: true,
        message: data.message,
      };
    } catch {
      return {
        success: false,
        message: "Network error occurred",
      };
    }
  }
}

export const videoManagementService = new VideoManagementService();
