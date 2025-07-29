import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditVideoModal } from "./edit-video-modal";
import { TestWrapper } from "@/__tests__/test-utils";

describe("EditVideoModal", () => {
  const mockOnClose = jest.fn();
  const mockOnEditFormChange = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    opened: true,
    onClose: mockOnClose,
    editForm: {
      title: "測試影片",
      description: "這是測試影片的描述",
      tags: ["測試", "影片"],
    },
    onEditFormChange: mockOnEditFormChange,
    onSave: mockOnSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("應該正確渲染模態框", () => {
    render(
      <TestWrapper>
        <EditVideoModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId("edit-video-modal")).toBeInTheDocument();
    expect(screen.getByText("編輯影片資訊")).toBeInTheDocument();
  });

  it("應該顯示表單欄位", () => {
    render(
      <TestWrapper>
        <EditVideoModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId("edit-title-input")).toBeInTheDocument();
    expect(screen.getByTestId("edit-description-input")).toBeInTheDocument();
    expect(screen.getByTestId("edit-tags-input")).toBeInTheDocument();
  });

  it("應該顯示正確的表單值", () => {
    render(
      <TestWrapper>
        <EditVideoModal {...defaultProps} />
      </TestWrapper>
    );

    const titleInput = screen.getByTestId(
      "edit-title-input"
    ) as HTMLInputElement;
    const descriptionInput = screen.getByTestId(
      "edit-description-input"
    ) as HTMLTextAreaElement;
    const tagsInput = screen.getByTestId("edit-tags-input") as HTMLInputElement;

    expect(titleInput.value).toBe("測試影片");
    expect(descriptionInput.value).toBe("這是測試影片的描述");
    expect(tagsInput.value).toBe("測試, 影片");
  });

  it("應該正確處理儲存按鈕點擊", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <EditVideoModal {...defaultProps} />
      </TestWrapper>
    );

    const saveButton = screen.getByTestId("save-edit-button");
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it("應該正確處理取消按鈕點擊", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <EditVideoModal {...defaultProps} />
      </TestWrapper>
    );

    const cancelButton = screen.getByText("取消");
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("應該正確處理標題輸入", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <EditVideoModal {...defaultProps} />
      </TestWrapper>
    );

    const titleInput = screen.getByTestId("edit-title-input");
    await user.type(titleInput, "新");

    expect(mockOnEditFormChange).toHaveBeenCalled();
  });

  it("應該正確處理描述輸入", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <EditVideoModal {...defaultProps} />
      </TestWrapper>
    );

    const descriptionInput = screen.getByTestId("edit-description-input");
    await user.type(descriptionInput, "新");

    expect(mockOnEditFormChange).toHaveBeenCalled();
  });

  it("應該正確處理標籤輸入", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <EditVideoModal {...defaultProps} />
      </TestWrapper>
    );

    const tagsInput = screen.getByTestId("edit-tags-input");
    await user.type(tagsInput, "新標籤");

    expect(mockOnEditFormChange).toHaveBeenCalled();
  });
});
