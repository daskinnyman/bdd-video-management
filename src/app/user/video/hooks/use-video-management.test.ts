import { renderHook, act } from "@testing-library/react";
import { useVideoManagement } from "./use-video-management";
import { mockVideos } from "../mock-data";

// Mock mockVideos
jest.mock("../mock-data", () => ({
  mockVideos: [
    {
      id: "1",
      title: "測試影片 1",
      description: "這是測試影片 1 的描述",
      status: "pending",
      uploadDate: "2024-01-01",
      tags: ["測試", "影片"],
    },
    {
      id: "2",
      title: "測試影片 2",
      description: "這是測試影片 2 的描述",
      status: "published",
      uploadDate: "2024-01-02",
      tags: ["測試", "影片", "完成"],
    },
  ],
}));

describe("useVideoManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("應該初始化正確的狀態", () => {
    const { result } = renderHook(() => useVideoManagement());

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
    it("應該正確設定編輯狀態", () => {
      const { result } = renderHook(() => useVideoManagement());
      const testVideo = mockVideos[0];

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
    it("應該正確設定刪除狀態", () => {
      const { result } = renderHook(() => useVideoManagement());
      const testVideo = mockVideos[0];

      act(() => {
        result.current.handleDelete(testVideo);
      });

      expect(result.current.deleteModalOpen).toBe(true);
      expect(result.current.videoToDelete).toEqual(testVideo);
    });
  });

  describe("confirmDelete", () => {
    it("應該正確刪除影片", () => {
      const { result } = renderHook(() => useVideoManagement());
      const testVideo = mockVideos[0];

      // 先設定要刪除的影片
      act(() => {
        result.current.handleDelete(testVideo);
      });

      // 確認刪除
      act(() => {
        result.current.confirmDelete();
      });

      expect(result.current.videos).toHaveLength(mockVideos.length - 1);
      expect(
        result.current.videos.find((v) => v.id === testVideo.id)
      ).toBeUndefined();
      expect(result.current.deleteModalOpen).toBe(false);
      expect(result.current.videoToDelete).toBeNull();
    });

    it("當沒有要刪除的影片時不應該執行刪除", () => {
      const { result } = renderHook(() => useVideoManagement());
      const initialVideos = [...result.current.videos];

      act(() => {
        result.current.confirmDelete();
      });

      expect(result.current.videos).toEqual(initialVideos);
    });
  });

  describe("saveEdit", () => {
    it("應該正確儲存編輯", () => {
      const { result } = renderHook(() => useVideoManagement());
      const testVideo = mockVideos[0];
      const updatedForm = {
        title: "更新的標題",
        description: "更新的描述",
        tags: ["更新", "標籤"],
      };

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
      act(() => {
        result.current.saveEdit();
      });

      const updatedVideo = result.current.videos.find(
        (v) => v.id === testVideo.id
      );
      expect(updatedVideo).toEqual({
        ...testVideo,
        ...updatedForm,
      });
      expect(result.current.editModalOpen).toBe(false);
    });

    it("當沒有編輯中的影片時不應該執行儲存", () => {
      const { result } = renderHook(() => useVideoManagement());
      const initialVideos = [...result.current.videos];

      act(() => {
        result.current.saveEdit();
      });

      expect(result.current.videos).toEqual(initialVideos);
    });
  });

  describe("handleEditFormChange", () => {
    it("應該正確更新表單欄位", () => {
      const { result } = renderHook(() => useVideoManagement());

      act(() => {
        result.current.handleEditFormChange("title", "新標題");
      });

      expect(result.current.editForm.title).toBe("新標題");
    });

    it("應該正確更新標籤陣列", () => {
      const { result } = renderHook(() => useVideoManagement());

      act(() => {
        result.current.handleEditFormChange("tags", ["標籤1", "標籤2"]);
      });

      expect(result.current.editForm.tags).toEqual(["標籤1", "標籤2"]);
    });
  });

  describe("handleLoadMore", () => {
    it("應該正確載入更多資料", async () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useVideoManagement());
      const initialVideosCount = result.current.videos.length;

      act(() => {
        result.current.handleLoadMore();
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        jest.runAllTimers();
      });

      // 等待非同步操作完成
      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.isLoading).toBe(false);
      // 由於 mockVideos 只有 2 個項目，載入後應該還是 2 個
      expect(result.current.videos.length).toBe(initialVideosCount);

      jest.useRealTimers();
    });
  });

  describe("toggleFilters", () => {
    it("應該正確切換篩選顯示狀態", () => {
      const { result } = renderHook(() => useVideoManagement());

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
    it("應該正確關閉編輯模態框", () => {
      const { result } = renderHook(() => useVideoManagement());

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
    it("應該正確關閉刪除模態框", () => {
      const { result } = renderHook(() => useVideoManagement());

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
