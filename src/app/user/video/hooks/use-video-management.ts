import { useState, useCallback, useEffect } from "react";
import { Video } from "../mock-data";
import { videoManagementService } from "../services/video-management-service";

export function useVideoManagement() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 編輯相關狀態
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    tags: [] as string[],
  });

  // 刪除相關狀態
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  // 載入影片列表
  const loadVideos = useCallback(
    async (page: number = 1, append: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await videoManagementService.getVideos({
          page,
          limit: 10,
        });

        if (response.success) {
          if (append) {
            setVideos((prev) => [...prev, ...response.data]);
          } else {
            setVideos(response.data);
          }
          setHasMore(page < response.pagination.totalPages);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 初始化載入
  useEffect(() => {
    loadVideos(1, false);
  }, [loadVideos]);

  // 處理編輯
  const handleEdit = useCallback((video: Video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description,
      tags: [...video.tags],
    });
    setEditModalOpen(true);
  }, []);

  // 處理刪除
  const handleDelete = useCallback((video: Video) => {
    setVideoToDelete(video);
    setDeleteModalOpen(true);
  }, []);

  // 確認刪除
  const confirmDelete = useCallback(async () => {
    if (videoToDelete) {
      try {
        const response = await videoManagementService.deleteVideo(
          videoToDelete.id
        );
        if (response.success) {
          setVideos((prev) => prev.filter((v) => v.id !== videoToDelete.id));
          setDeleteModalOpen(false);
          setVideoToDelete(null);
        } else {
          console.error("Failed to delete video:", response.message);
        }
      } catch (error) {
        console.error("Failed to delete video:", error);
      }
    }
  }, [videoToDelete]);

  // 儲存編輯
  const saveEdit = useCallback(async () => {
    if (editingVideo) {
      try {
        const response = await videoManagementService.updateVideo({
          id: editingVideo.id,
          title: editForm.title,
          description: editForm.description,
          tags: editForm.tags,
        });

        if (response.success && response.data) {
          setVideos((prev) =>
            prev.map((v) => (v.id === editingVideo.id ? response.data! : v))
          );
          setEditModalOpen(false);
          setEditingVideo(null);
        } else {
          console.error("Failed to update video:", response.message);
        }
      } catch (error) {
        console.error("Failed to update video:", error);
      }
    }
  }, [editingVideo, editForm]);

  // 處理編輯表單變更
  const handleEditFormChange = useCallback(
    (field: string, value: string | string[]) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 載入更多資料（模擬無限滾動）
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadVideos(currentPage + 1, true);
    }
  }, [isLoading, hasMore, currentPage, loadVideos]);

  // 切換篩選顯示
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // 關閉編輯模態框
  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
  }, []);

  // 關閉刪除模態框
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  return {
    // 狀態
    videos,
    isLoading,
    showFilters,
    editModalOpen,
    deleteModalOpen,
    editForm,
    videoToDelete,

    // 事件處理
    handleEdit,
    handleDelete,
    confirmDelete,
    saveEdit,
    handleEditFormChange,
    handleLoadMore,
    toggleFilters,
    closeEditModal,
    closeDeleteModal,
  };
}
