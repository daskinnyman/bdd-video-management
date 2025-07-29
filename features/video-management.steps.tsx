import { defineFeature, loadFeature } from "jest-cucumber";
import { jest } from "@jest/globals";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import VideoManagementPage from "../src/app/user/video/page";
import { mockVideos, Video } from "../src/app/user/video/mock-data";

const feature = loadFeature("./features/video-management.feature");

// Mock hooks
const mockUseVideoManagement = jest.fn();
jest.mock("../src/app/user/video/hooks", () => ({
  useVideoManagement: () => mockUseVideoManagement(),
}));

// Mock components
jest.mock("../src/app/user/video/components", () => ({
  VideoTable: jest.fn(
    ({ videos, onEdit, onDelete, onBottomReached, isLoading }) => (
      <div data-testid="video-table">
        {videos.length === 0 ? (
          <div data-testid="empty-state">
            <div data-testid="empty-icon">📭</div>
            <div data-testid="empty-message">No data found</div>
          </div>
        ) : (
          <div data-testid="video-list">
            {videos.map((video: Video, index: number) => (
              <div key={video.id} data-testid={`video-item-${index}`}>
                <div data-testid={`video-title-${index}`}>{video.title}</div>
                <div data-testid={`video-description-${index}`}>
                  {video.description}
                </div>
                <div data-testid={`video-status-${index}`}>{video.status}</div>
                <div data-testid={`video-upload-date-${index}`}>
                  {video.uploadDate}
                </div>
                <div data-testid={`video-tags-${index}`}>
                  {video.tags.join(", ")}
                </div>
                <button
                  data-testid={`edit-button-${index}`}
                  onClick={() => onEdit(video)}
                >
                  編輯
                </button>
                <button
                  data-testid={`delete-button-${index}`}
                  onClick={() => onDelete(video)}
                >
                  刪除
                </button>
              </div>
            ))}
            {isLoading && <div data-testid="loading-indicator">載入中...</div>}
            <button data-testid="load-more-button" onClick={onBottomReached}>
              載入更多
            </button>
          </div>
        )}
      </div>
    )
  ),
  EditVideoModal: jest.fn(
    ({ opened, onClose, editForm, onEditFormChange, onSave }) =>
      opened ? (
        <div data-testid="edit-video-modal">
          <label htmlFor="edit-title-input">標題</label>
          <input
            id="edit-title-input"
            data-testid="edit-title-input"
            value={editForm.title}
            onChange={(e) => onEditFormChange("title", e.target.value)}
          />
          <label htmlFor="edit-description-input">描述</label>
          <textarea
            id="edit-description-input"
            data-testid="edit-description-input"
            value={editForm.description}
            onChange={(e) => onEditFormChange("description", e.target.value)}
          />
          <label htmlFor="edit-tags-input">標籤</label>
          <input
            id="edit-tags-input"
            data-testid="edit-tags-input"
            value={editForm.tags.join(", ")}
            onChange={(e) =>
              onEditFormChange("tags", e.target.value.split(", "))
            }
          />
          <button data-testid="save-edit-button" onClick={onSave}>
            儲存
          </button>
          <button onClick={onClose}>取消</button>
        </div>
      ) : null
  ),
  DeleteVideoModal: jest.fn(({ opened, onClose, video, onConfirm }) =>
    opened ? (
      <div data-testid="delete-video-modal">
        <div>
          確定要刪除影片 &quot;{video?.title}&quot; 嗎？此操作無法復原。
        </div>
        <button data-testid="confirm-delete-button" onClick={onConfirm}>
          確認刪除
        </button>
        <button onClick={onClose}>取消</button>
      </div>
    ) : null
  ),
}));

// 測試包裝器
const renderWithMantine = (component: React.ReactElement) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

defineFeature(feature, (test) => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("User can view all videos", ({ given, when, then }) => {
    const mockHandleEdit = jest.fn();
    const mockHandleDelete = jest.fn();
    const mockHandleLoadMore = jest.fn();
    const mockToggleFilters = jest.fn();
    const mockCloseEditModal = jest.fn();
    const mockCloseDeleteModal = jest.fn();

    given("I am logged in as a user", () => {
      mockUseVideoManagement.mockReturnValue({
        videos: mockVideos,
        isLoading: false,
        showFilters: false,
        editModalOpen: false,
        deleteModalOpen: false,
        editForm: { title: "", description: "", tags: [] },
        videoToDelete: null,
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: jest.fn(),
        saveEdit: jest.fn(),
        handleEditFormChange: jest.fn(),
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });
    });

    when("I view the video management page", () => {
      renderWithMantine(<VideoManagementPage />);
    });

    then("I should see the video list with 50 videos", async () => {
      await waitFor(() => {
        expect(screen.getByTestId("video-table")).toBeInTheDocument();
        expect(screen.getByTestId("video-list")).toBeInTheDocument();
      });

      // 驗證顯示了 50 個影片
      const videoItems = screen.getAllByTestId(/^video-item-/);
      expect(videoItems).toHaveLength(50);

      // 驗證第一個影片的資訊
      expect(screen.getByTestId("video-title-0")).toHaveTextContent(
        mockVideos[0].title
      );
      expect(screen.getByTestId("video-description-0")).toHaveTextContent(
        mockVideos[0].description
      );
      expect(screen.getByTestId("video-status-0")).toHaveTextContent(
        mockVideos[0].status
      );
      expect(screen.getByTestId("video-upload-date-0")).toHaveTextContent(
        mockVideos[0].uploadDate
      );
    });
  });

  test("User can see the video information", ({ given, when, then }) => {
    const mockHandleEdit = jest.fn();
    const mockHandleDelete = jest.fn();
    const mockHandleLoadMore = jest.fn();
    const mockToggleFilters = jest.fn();
    const mockCloseEditModal = jest.fn();
    const mockCloseDeleteModal = jest.fn();

    given("I am logged in as a user", () => {
      mockUseVideoManagement.mockReturnValue({
        videos: mockVideos,
        isLoading: false,
        showFilters: false,
        editModalOpen: false,
        deleteModalOpen: false,
        editForm: { title: "", description: "", tags: [] },
        videoToDelete: null,
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: jest.fn(),
        saveEdit: jest.fn(),
        handleEditFormChange: jest.fn(),
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });
    });

    when("I view the video management page", () => {
      renderWithMantine(<VideoManagementPage />);
    });

    then(
      "I should see the video information including title, description, status, upload date and tag",
      async () => {
        await waitFor(() => {
          expect(screen.getByTestId("video-table")).toBeInTheDocument();
        });

        // 驗證第一個影片包含所有必要資訊
        const firstVideo = mockVideos[0];
        expect(screen.getByTestId("video-title-0")).toHaveTextContent(
          firstVideo.title
        );
        expect(screen.getByTestId("video-description-0")).toHaveTextContent(
          firstVideo.description
        );
        expect(screen.getByTestId("video-status-0")).toHaveTextContent(
          firstVideo.status
        );
        expect(screen.getByTestId("video-upload-date-0")).toHaveTextContent(
          firstVideo.uploadDate
        );
        expect(screen.getByTestId("video-tags-0")).toHaveTextContent(
          firstVideo.tags.join(", ")
        );
      }
    );
  });

  test("User can edit the video information", ({ given, when, then }) => {
    const mockHandleEdit = jest.fn();
    const mockHandleDelete = jest.fn();
    const mockHandleLoadMore = jest.fn();
    const mockToggleFilters = jest.fn();
    const mockCloseEditModal = jest.fn();
    const mockCloseDeleteModal = jest.fn();
    const mockSaveEdit = jest.fn();
    const mockHandleEditFormChange = jest.fn();

    given("I am logged in as a user", () => {
      mockUseVideoManagement.mockReturnValue({
        videos: mockVideos,
        isLoading: false,
        showFilters: false,
        editModalOpen: false,
        deleteModalOpen: false,
        editForm: { title: "", description: "", tags: [] },
        videoToDelete: null,
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: jest.fn(),
        saveEdit: mockSaveEdit,
        handleEditFormChange: mockHandleEditFormChange,
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });
    });

    when("I view the video management page", () => {
      renderWithMantine(<VideoManagementPage />);
    });

    when("I click on the edit button of a video", async () => {
      const editButton = screen.getByTestId("edit-button-0");
      await user.click(editButton);

      expect(mockHandleEdit).toHaveBeenCalledWith(mockVideos[0]);
      expect(mockHandleEdit).toHaveBeenCalledTimes(1);
    });

    then("I should see the edit video modal", async () => {
      // 重新設定 mock 以顯示編輯模態框
      mockUseVideoManagement.mockReturnValue({
        videos: mockVideos,
        isLoading: false,
        showFilters: false,
        editModalOpen: true,
        deleteModalOpen: false,
        editForm: {
          title: mockVideos[0].title,
          description: mockVideos[0].description,
          tags: mockVideos[0].tags,
        },
        videoToDelete: null,
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: jest.fn(),
        saveEdit: mockSaveEdit,
        handleEditFormChange: mockHandleEditFormChange,
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });

      cleanup();
      renderWithMantine(<VideoManagementPage />);

      await waitFor(() => {
        expect(screen.getByTestId("edit-video-modal")).toBeInTheDocument();
      });
    });

    when("I edit the video information", async () => {
      const titleInput = screen.getByTestId("edit-title-input");
      const descriptionInput = screen.getByTestId("edit-description-input");
      const tagsInput = screen.getByTestId("edit-tags-input");

      // 清除並重新輸入標題
      await user.clear(titleInput);
      await user.type(titleInput, "更新後的標題");

      // 驗證 handleEditFormChange 被呼叫
      expect(mockHandleEditFormChange).toHaveBeenCalled();

      // 清除並重新輸入描述
      await user.clear(descriptionInput);
      await user.type(descriptionInput, "更新後的描述");

      // 驗證 handleEditFormChange 被呼叫
      expect(mockHandleEditFormChange).toHaveBeenCalled();

      // 清除並重新輸入標籤
      await user.clear(tagsInput);
      await user.type(tagsInput, "新標籤1, 新標籤2");

      // 驗證 handleEditFormChange 被呼叫
      expect(mockHandleEditFormChange).toHaveBeenCalled();
    });

    then(
      "I should see the updated video information in the video list",
      async () => {
        const saveButton = screen.getByTestId("save-edit-button");
        await user.click(saveButton);

        expect(mockSaveEdit).toHaveBeenCalledTimes(1);
      }
    );
  });

  test("User can delete the video", ({ given, when, then }) => {
    const mockHandleEdit = jest.fn();
    const mockHandleDelete = jest.fn();
    const mockHandleLoadMore = jest.fn();
    const mockToggleFilters = jest.fn();
    const mockCloseEditModal = jest.fn();
    const mockCloseDeleteModal = jest.fn();
    const mockConfirmDelete = jest.fn();

    given("I am logged in as a user", () => {
      mockUseVideoManagement.mockReturnValue({
        videos: mockVideos,
        isLoading: false,
        showFilters: false,
        editModalOpen: false,
        deleteModalOpen: false,
        editForm: { title: "", description: "", tags: [] },
        videoToDelete: null,
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: mockConfirmDelete,
        saveEdit: jest.fn(),
        handleEditFormChange: jest.fn(),
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });
    });

    when("I view the video management page", () => {
      renderWithMantine(<VideoManagementPage />);
    });

    when("I click on the delete button of a video", async () => {
      const deleteButton = screen.getByTestId("delete-button-0");
      await user.click(deleteButton);

      expect(mockHandleDelete).toHaveBeenCalledWith(mockVideos[0]);
      expect(mockHandleDelete).toHaveBeenCalledTimes(1);
    });

    then("I should see the delete video modal", async () => {
      // 重新設定 mock 以顯示刪除模態框
      mockUseVideoManagement.mockReturnValue({
        videos: mockVideos,
        isLoading: false,
        showFilters: false,
        editModalOpen: false,
        deleteModalOpen: true,
        editForm: { title: "", description: "", tags: [] },
        videoToDelete: mockVideos[0],
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: mockConfirmDelete,
        saveEdit: jest.fn(),
        handleEditFormChange: jest.fn(),
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });

      cleanup();
      renderWithMantine(<VideoManagementPage />);

      await waitFor(() => {
        expect(screen.getByTestId("delete-video-modal")).toBeInTheDocument();
        expect(
          screen.getByText(
            `確定要刪除影片 "${mockVideos[0].title}" 嗎？此操作無法復原。`
          )
        ).toBeInTheDocument();
      });
    });

    when("I confirm the deletion", async () => {
      const confirmButton = screen.getByTestId("confirm-delete-button");
      await user.click(confirmButton);

      expect(mockConfirmDelete).toHaveBeenCalledTimes(1);
    });

    then("I should see the video list without the deleted video", async () => {
      // 重新設定 mock 以顯示刪除後的影片列表
      const remainingVideos = mockVideos.filter(
        (v) => v.id !== mockVideos[0].id
      );
      mockUseVideoManagement.mockReturnValue({
        videos: remainingVideos,
        isLoading: false,
        showFilters: false,
        editModalOpen: false,
        deleteModalOpen: false,
        editForm: { title: "", description: "", tags: [] },
        videoToDelete: null,
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: mockConfirmDelete,
        saveEdit: jest.fn(),
        handleEditFormChange: jest.fn(),
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });

      cleanup();
      renderWithMantine(<VideoManagementPage />);

      await waitFor(() => {
        expect(screen.getByTestId("video-table")).toBeInTheDocument();
        expect(screen.getByTestId("video-list")).toBeInTheDocument();
      });

      // 驗證刪除的影片不再顯示
      const videoItems = screen.getAllByTestId(/^video-item-/);
      expect(videoItems).toHaveLength(49); // 原本 50 個，刪除 1 個後剩 49 個
    });
  });

  test("User should see empty video list when there is no video", ({
    given,
    when,
    then,
  }) => {
    const mockHandleEdit = jest.fn();
    const mockHandleDelete = jest.fn();
    const mockHandleLoadMore = jest.fn();
    const mockToggleFilters = jest.fn();
    const mockCloseEditModal = jest.fn();
    const mockCloseDeleteModal = jest.fn();

    given("I am logged in as a user", () => {
      mockUseVideoManagement.mockReturnValue({
        videos: [], // 空影片列表
        isLoading: false,
        showFilters: false,
        editModalOpen: false,
        deleteModalOpen: false,
        editForm: { title: "", description: "", tags: [] },
        videoToDelete: null,
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: jest.fn(),
        saveEdit: jest.fn(),
        handleEditFormChange: jest.fn(),
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });
    });

    when("I view the video management page", () => {
      renderWithMantine(<VideoManagementPage />);
    });

    then(
      'I should see an empty data icon with a message "No data found"',
      async () => {
        await waitFor(() => {
          expect(screen.getByTestId("video-table")).toBeInTheDocument();
          expect(screen.getByTestId("empty-state")).toBeInTheDocument();
          expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
          expect(screen.getByTestId("empty-message")).toHaveTextContent(
            "No data found"
          );
        });
      }
    );
  });

  test("User can see the video list with infinite scroll", ({
    given,
    when,
    then,
  }) => {
    const mockHandleEdit = jest.fn();
    const mockHandleDelete = jest.fn();
    const mockHandleLoadMore = jest.fn();
    const mockToggleFilters = jest.fn();
    const mockCloseEditModal = jest.fn();
    const mockCloseDeleteModal = jest.fn();

    given("I am logged in as a user", () => {
      mockUseVideoManagement.mockReturnValue({
        videos: mockVideos,
        isLoading: false,
        showFilters: false,
        editModalOpen: false,
        deleteModalOpen: false,
        editForm: { title: "", description: "", tags: [] },
        videoToDelete: null,
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: jest.fn(),
        saveEdit: jest.fn(),
        handleEditFormChange: jest.fn(),
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });
    });

    when("I view the video management page", () => {
      renderWithMantine(<VideoManagementPage />);
    });

    then("I should see the video list with infinite scroll", async () => {
      await waitFor(() => {
        expect(screen.getByTestId("video-table")).toBeInTheDocument();
        expect(screen.getByTestId("video-list")).toBeInTheDocument();
        expect(screen.getByTestId("load-more-button")).toBeInTheDocument();
      });

      // 測試載入更多功能
      const loadMoreButton = screen.getByTestId("load-more-button");
      await user.click(loadMoreButton);

      expect(mockHandleLoadMore).toHaveBeenCalledTimes(1);

      // 測試載入中的狀態
      mockUseVideoManagement.mockReturnValue({
        videos: mockVideos,
        isLoading: true, // 設定為載入中
        showFilters: false,
        editModalOpen: false,
        deleteModalOpen: false,
        editForm: { title: "", description: "", tags: [] },
        videoToDelete: null,
        handleEdit: mockHandleEdit,
        handleDelete: mockHandleDelete,
        confirmDelete: jest.fn(),
        saveEdit: jest.fn(),
        handleEditFormChange: jest.fn(),
        handleLoadMore: mockHandleLoadMore,
        toggleFilters: mockToggleFilters,
        closeEditModal: mockCloseEditModal,
        closeDeleteModal: mockCloseDeleteModal,
      });

      cleanup();
      renderWithMantine(<VideoManagementPage />);

      await waitFor(() => {
        expect(screen.getByTestId("loading-indicator")).toHaveTextContent(
          "載入中..."
        );
      });
    });
  });
});
