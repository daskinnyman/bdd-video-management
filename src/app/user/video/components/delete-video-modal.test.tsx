import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteVideoModal } from "./delete-video-modal";
import { TestWrapper } from "@/__tests__/test-utils";

describe("DeleteVideoModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const testVideo = {
    id: "1",
    title: "測試影片",
    description: "這是測試影片的描述",
    status: "pending" as const,
    uploadDate: "2024-01-01",
    tags: ["測試", "影片"],
  };

  const defaultProps = {
    opened: true,
    onClose: mockOnClose,
    video: testVideo,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("應該正確渲染模態框", () => {
    render(
      <TestWrapper>
        <DeleteVideoModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId("delete-video-modal")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "確認刪除" })
    ).toBeInTheDocument();
  });

  it("應該顯示正確的確認訊息", () => {
    render(
      <TestWrapper>
        <DeleteVideoModal {...defaultProps} />
      </TestWrapper>
    );

    expect(
      screen.getByText(/確定要刪除影片 "測試影片" 嗎？此操作無法復原。/)
    ).toBeInTheDocument();
  });

  it("應該顯示取消和確認按鈕", () => {
    render(
      <TestWrapper>
        <DeleteVideoModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText("取消")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-delete-button")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "確認刪除" })
    ).toBeInTheDocument();
  });

  it("應該正確處理取消按鈕點擊", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <DeleteVideoModal {...defaultProps} />
      </TestWrapper>
    );

    const cancelButton = screen.getByText("取消");
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("應該正確處理確認刪除按鈕點擊", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <DeleteVideoModal {...defaultProps} />
      </TestWrapper>
    );

    const confirmButton = screen.getByTestId("confirm-delete-button");
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("應該正確處理沒有影片的情況", () => {
    render(
      <TestWrapper>
        <DeleteVideoModal {...defaultProps} video={null} />
      </TestWrapper>
    );

    expect(
      screen.getByText(/確定要刪除影片 "" 嗎？此操作無法復原。/)
    ).toBeInTheDocument();
  });

  it("應該正確處理不同影片標題", () => {
    const differentVideo = {
      ...testVideo,
      title: "另一個影片",
    };

    render(
      <TestWrapper>
        <DeleteVideoModal {...defaultProps} video={differentVideo} />
      </TestWrapper>
    );

    expect(
      screen.getByText(/確定要刪除影片 "另一個影片" 嗎？此操作無法復原。/)
    ).toBeInTheDocument();
  });
});
