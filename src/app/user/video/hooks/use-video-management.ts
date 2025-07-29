import { useState, useCallback } from "react";
import { Video, mockVideos } from "../mock-data";

export function useVideoManagement() {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
  const confirmDelete = useCallback(() => {
    if (videoToDelete) {
      setVideos((prev) => prev.filter((v) => v.id !== videoToDelete.id));
      setDeleteModalOpen(false);
      setVideoToDelete(null);
    }
  }, [videoToDelete]);

  // 儲存編輯
  const saveEdit = useCallback(() => {
    if (editingVideo) {
      setVideos((prev) =>
        prev.map((v) => (v.id === editingVideo.id ? { ...v, ...editForm } : v))
      );
      setEditModalOpen(false);
      setEditingVideo(null);
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
    setIsLoading(true);
    // 模擬 API 呼叫延遲
    setTimeout(() => {
      const newVideos = mockVideos.slice(videos.length, videos.length + 10);
      if (newVideos.length > 0) {
        setVideos((prev) => [...prev, ...newVideos]);
      }
      setIsLoading(false);
    }, 1000);
  }, [videos.length]);

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
