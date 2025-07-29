import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoTable } from "./video-table";
import { Video } from "../mock-data";

// Mock DataTable component
jest.mock("@/app/components/data-table", () => ({
  DataTable: ({
    onBottomReached,
    isLoading,
    showFilters,
  }: {
    onBottomReached: () => void;
    isLoading: boolean;
    showFilters: boolean;
  }) => (
    <div data-testid="data-table">
      <div data-testid="table-loading">
        {isLoading ? "Loading" : "Not Loading"}
      </div>
      <div data-testid="table-filters">
        {showFilters ? "Filters Shown" : "Filters Hidden"}
      </div>
      <button onClick={onBottomReached} data-testid="load-more-button">
        Load More
      </button>
    </div>
  ),
}));

// Mock mock-data
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
  getStatusText: jest.fn((status) => status),
  getStatusColor: jest.fn(() => "blue"),
}));

describe("VideoTable", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnBottomReached = jest.fn();

  const defaultProps = {
    videos: [
      {
        id: "1",
        title: "測試影片 1",
        description: "這是測試影片 1 的描述",
        status: "pending" as const,
        uploadDate: "2024-01-01",
        tags: ["測試", "影片"],
      },
      {
        id: "2",
        title: "測試影片 2",
        description: "這是測試影片 2 的描述",
        status: "published" as const,
        uploadDate: "2024-01-02",
        tags: ["測試", "影片", "完成"],
      },
    ] as Video[],
    onBottomReached: mockOnBottomReached,
    isLoading: false,
    showFilters: false,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("應該正確渲染表格", () => {
    render(<VideoTable {...defaultProps} />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-loading")).toHaveTextContent(
      "Not Loading"
    );
    expect(screen.getByTestId("table-filters")).toHaveTextContent(
      "Filters Hidden"
    );
  });

  it("應該顯示載入狀態", () => {
    render(<VideoTable {...defaultProps} isLoading={true} />);

    expect(screen.getByTestId("table-loading")).toHaveTextContent("Loading");
  });

  it("應該顯示篩選狀態", () => {
    render(<VideoTable {...defaultProps} showFilters={true} />);

    expect(screen.getByTestId("table-filters")).toHaveTextContent(
      "Filters Shown"
    );
  });

  it("應該正確處理載入更多按鈕點擊", async () => {
    const user = userEvent.setup();
    render(<VideoTable {...defaultProps} />);

    const loadMoreButton = screen.getByTestId("load-more-button");
    await user.click(loadMoreButton);

    expect(mockOnBottomReached).toHaveBeenCalledTimes(1);
  });

  it("應該正確處理空資料", () => {
    render(<VideoTable {...defaultProps} videos={[]} />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });
});
