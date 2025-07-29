import { renderHook, act } from "@testing-library/react";
import { useVideoManagement } from "./use-video-management";
import { videoManagementService } from "../services/video-management-service";

// Mock videoManagementService
jest.mock("../services/video-management-service");

const mockVideoManagementService = videoManagementService as jest.Mocked<
  typeof videoManagementService
>;

// Mock videos data
const mockVideos = [
  {
    id: "video-1",
    title: "測試影片 1",
    description: "這是測試影片 1 的描述",
    status: "pending" as const,
    uploadDate: "2024-01-01",
    tags: ["測試", "影片"],
    thumbnailUrl: "https://picsum.photos/300/200?random=1",
    duration: "15:30",
    views: 1250,
  },
  {
    id: "video-2",
    title: "測試影片 2",
    description: "這是測試影片 2 的描述",
    status: "published" as const,
    uploadDate: "2024-01-02",
    tags: ["測試", "影片", "完成"],
    thumbnailUrl: "https://picsum.photos/300/200?random=2",
    duration: "22:15",
    views: 890,
  },
];

describe("useVideoManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock getVideos to return mock data
    mockVideoManagementService.getVideos.mockResolvedValue({
      success: true,
      data: mockVideos,
      pagination: {
        page: 1,
        limit: 10,
        total: mockVideos.length,
        totalPages: 1,
      },
    });

    // Mock updateVideo
    mockVideoManagementService.updateVideo.mockResolvedValue({
      success: true,
      message: "Video updated successfully",
      data: mockVideos[0],
    });

    // Mock deleteVideo
    mockVideoManagementService.deleteVideo.mockResolvedValue({
      success: true,
      message: "Video deleted successfully",
    });
  });

  it("應該初始化正確的狀態", async () => {
    const { result } = renderHook(() => useVideoManagement());

    // 等待初始載入完成
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.videos).toEqual(mockVideos);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.showFilters).toBe(false);
    expect(result.current.editModalOpen).toBe(false);
    expect(result.current.deleteModalOpen).toBe(false);
    expect(result.current.editForm).toEqual({
      title: "",
      description: "",
      tags: [],
    });
    expect(result.current.videoToDelete).toBeNull();
  });

  describe("handleEdit", () => {
    it("應該正確設定編輯狀態", async () => {
      const { result } = renderHook(() => useVideoManagement());
      const testVideo = mockVideos[0];

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.handleEdit(testVideo);
      });

      expect(result.current.editModalOpen).toBe(true);
      expect(result.current.editForm).toEqual({
        title: testVideo.title,
        description: testVideo.description,
        tags: [...testVideo.tags],
      });
    });
  });

  describe("handleDelete", () => {
    it("應該正確設定刪除狀態", async () => {
      const { result } = renderHook(() => useVideoManagement());
      const testVideo = mockVideos[0];

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.handleDelete(testVideo);
      });

      expect(result.current.deleteModalOpen).toBe(true);
      expect(result.current.videoToDelete).toEqual(testVideo);
    });
  });

  describe("confirmDelete", () => {
    it("應該正確刪除影片", async () => {
      const { result } = renderHook(() => useVideoManagement());

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const testVideo = mockVideos[0];
      const initialVideosCount = result.current.videos.length;

      // 先設定要刪除的影片
      act(() => {
        result.current.handleDelete(testVideo);
      });

      // 確認刪除
      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(mockVideoManagementService.deleteVideo).toHaveBeenCalledWith(
        testVideo.id
      );
      expect(mockVideoManagementService.deleteVideo).toHaveBeenCalledTimes(1);
      expect(result.current.videos).toHaveLength(initialVideosCount - 1);
      expect(
        result.current.videos.find((v) => v.id === testVideo.id)
      ).toBeUndefined();
      expect(result.current.deleteModalOpen).toBe(false);
      expect(result.current.videoToDelete).toBeNull();
    });

    it("當沒有要刪除的影片時不應該執行刪除", async () => {
      const { result } = renderHook(() => useVideoManagement());

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const initialVideos = [...result.current.videos];

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(mockVideoManagementService.deleteVideo).not.toHaveBeenCalled();
      expect(result.current.videos).toEqual(initialVideos);
    });
  });

  describe("saveEdit", () => {
    it("應該正確儲存編輯", async () => {
      const { result } = renderHook(() => useVideoManagement());
      const testVideo = mockVideos[0];
      const updatedForm = {
        title: "更新的標題",
        description: "更新的描述",
        tags: ["更新", "標籤"],
      };

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // 先開啟編輯
      act(() => {
        result.current.handleEdit(testVideo);
      });

      // 更新表單
      act(() => {
        result.current.handleEditFormChange("title", updatedForm.title);
        result.current.handleEditFormChange(
          "description",
          updatedForm.description
        );
        result.current.handleEditFormChange("tags", updatedForm.tags);
      });

      // 儲存編輯
      await act(async () => {
        await result.current.saveEdit();
      });

      expect(mockVideoManagementService.updateVideo).toHaveBeenCalledWith({
        id: testVideo.id,
        title: updatedForm.title,
        description: updatedForm.description,
        tags: updatedForm.tags,
      });
      expect(mockVideoManagementService.updateVideo).toHaveBeenCalledTimes(1);
      expect(result.current.editModalOpen).toBe(false);
    });

    it("當沒有編輯中的影片時不應該執行儲存", async () => {
      const { result } = renderHook(() => useVideoManagement());

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        await result.current.saveEdit();
      });

      expect(mockVideoManagementService.updateVideo).not.toHaveBeenCalled();
    });
  });

  describe("handleEditFormChange", () => {
    it("應該正確更新表單欄位", async () => {
      const { result } = renderHook(() => useVideoManagement());

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.handleEditFormChange("title", "新標題");
      });

      expect(result.current.editForm.title).toBe("新標題");
    });

    it("應該正確更新標籤陣列", async () => {
      const { result } = renderHook(() => useVideoManagement());

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.handleEditFormChange("tags", ["標籤1", "標籤2"]);
      });

      expect(result.current.editForm.tags).toEqual(["標籤1", "標籤2"]);
    });
  });

  describe("handleLoadMore", () => {
    it("應該正確載入更多資料", async () => {
      // 先設定初始資料，讓 hasMore 為 true
      mockVideoManagementService.getVideos.mockResolvedValueOnce({
        success: true,
        data: mockVideos,
        pagination: {
          page: 1,
          limit: 10,
          total: 20, // 總數大於當前頁面數量，讓 hasMore 為 true
          totalPages: 2,
        },
      });

      const { result } = renderHook(() => useVideoManagement());

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const initialVideosCount = result.current.videos.length;

      // Mock 第二頁資料
      const moreVideos = [
        {
          id: "video-3",
          title: "測試影片 3",
          description: "這是測試影片 3 的描述",
          status: "published" as const,
          uploadDate: "2024-01-03",
          tags: ["測試", "影片"],
          thumbnailUrl: "https://picsum.photos/300/200?random=3",
          duration: "18:45",
          views: 567,
        },
      ];

      mockVideoManagementService.getVideos.mockResolvedValueOnce({
        success: true,
        data: moreVideos,
        pagination: {
          page: 2,
          limit: 10,
          total: 20,
          totalPages: 2,
        },
      });

      await act(async () => {
        await result.current.handleLoadMore();
      });

      expect(mockVideoManagementService.getVideos).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
      });
      expect(result.current.videos).toHaveLength(
        initialVideosCount + moreVideos.length
      );
    });
  });

  describe("toggleFilters", () => {
    it("應該正確切換篩選顯示狀態", async () => {
      const { result } = renderHook(() => useVideoManagement());

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.showFilters).toBe(false);

      act(() => {
        result.current.toggleFilters();
      });

      expect(result.current.showFilters).toBe(true);

      act(() => {
        result.current.toggleFilters();
      });

      expect(result.current.showFilters).toBe(false);
    });
  });

  describe("closeEditModal", () => {
    it("應該正確關閉編輯模態框", async () => {
      const { result } = renderHook(() => useVideoManagement());

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // 先開啟編輯模態框
      act(() => {
        result.current.handleEdit(mockVideos[0]);
      });

      expect(result.current.editModalOpen).toBe(true);

      act(() => {
        result.current.closeEditModal();
      });

      expect(result.current.editModalOpen).toBe(false);
    });
  });

  describe("closeDeleteModal", () => {
    it("應該正確關閉刪除模態框", async () => {
      const { result } = renderHook(() => useVideoManagement());

      // 等待初始載入完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // 先開啟刪除模態框
      act(() => {
        result.current.handleDelete(mockVideos[0]);
      });

      expect(result.current.deleteModalOpen).toBe(true);

      act(() => {
        result.current.closeDeleteModal();
      });

      expect(result.current.deleteModalOpen).toBe(false);
    });
  });
});
