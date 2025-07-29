"use client";

import React from "react";
import { Button } from "@mantine/core";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { VideoTable, EditVideoModal, DeleteVideoModal } from "./components";
import { useVideoManagement } from "./hooks";
import classes from "./video-management.module.scss";

export default function VideoManagementPage() {
  const {
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
  } = useVideoManagement();

  return (
    <div className={classes.videoManagementPage}>
      {/* 頁面標題和操作 */}
      <div className={classes.pageHeader}>
        <h1 className={classes.pageTitle}>📹 影片管理</h1>
        <div className={classes.headerActions}>
          <Button
            variant={showFilters ? "filled" : "light"}
            onClick={toggleFilters}
            data-testid="toggle-filters-button"
          >
            {showFilters ? "隱藏篩選" : "顯示篩選"}
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* 表格容器 */}
      <VideoTable
        videos={videos}
        onBottomReached={handleLoadMore}
        isLoading={isLoading}
        showFilters={showFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 編輯模態框 */}
      <EditVideoModal
        opened={editModalOpen}
        onClose={closeEditModal}
        editForm={editForm}
        onEditFormChange={handleEditFormChange}
        onSave={saveEdit}
      />

      {/* 刪除確認模態框 */}
      <DeleteVideoModal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        video={videoToDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
