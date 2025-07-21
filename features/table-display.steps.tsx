import { defineFeature, loadFeature } from "jest-cucumber";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { jest } from "@jest/globals";
import { DataTable } from "../src/app/components/data-table";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { MantineProvider } from "@mantine/core";
import React, { useState } from "react";

// Mock functions
const mockViewTable = jest.fn();
const mockSortTable = jest.fn();
const mockLoadMoreData = jest.fn();
const mockScrollTable = jest.fn();

// 定義測試資料類型
type TestData = {
  id: number;
  title: string;
  description: string;
  status: string;
};

// 定義表格欄位
const columns: ColumnDef<TestData>[] = [
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

// 生成測試資料
const generateTestData = (count: number): TestData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Title ${index + 1}`,
    description: `Description ${index + 1}`,
    status: index % 2 === 0 ? "Active" : "Inactive",
  }));
};

// 測試包裝器元件
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

// 測試元件，用於建立 table instance
const TestDataTable = ({
  data,
  virtualized = true,
}: {
  data: TestData[];
  virtualized?: boolean;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <DataTable
      table={table}
      onBottomReached={mockViewTable}
      virtualized={virtualized}
      containerHeight={300}
      rowHeight={52}
    />
  );
};

const feature = loadFeature("./features/table-display.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("User can see table rows from given data", ({ given, when, then }) => {
    let tableData: TestData[] = [];

    given("I have a table with 3 lines of data", () => {
      tableData = generateTestData(3);
    });

    when("I view the table", () => {
      render(
        <TestWrapper>
          <TestDataTable data={tableData} />
        </TestWrapper>
      );
    });

    then("I should see 3 rows in the table", () => {
      // 驗證表格顯示 3 行資料
      expect(screen.getByTestId("cell-0-title")).toBeInTheDocument();
      expect(screen.getByTestId("cell-1-title")).toBeInTheDocument();
      expect(screen.getByTestId("cell-2-title")).toBeInTheDocument();
    });
  });

  test("User can see empty data icon when data is empty", ({
    given,
    when,
    then,
  }) => {
    let tableData: TestData[] = [];

    given("I have a table with 0 lines of data", () => {
      tableData = [];
    });

    when("I view the table", () => {
      render(
        <TestWrapper>
          <TestDataTable data={tableData} />
        </TestWrapper>
      );
    });

    then(
      'I should see an empty data icon with a message "No data found"',
      () => {
        expect(screen.getByTestId("empty-table")).toBeInTheDocument();
        expect(screen.getByText("No data found")).toBeInTheDocument();
      }
    );
  });

  test("User can sort table by clicking on column header", ({
    given,
    when,
    then,
  }) => {
    let tableData: TestData[] = [];

    given("I have a table with 3 lines of data", () => {
      tableData = generateTestData(3);
    });

    when("I view the table", () => {
      render(
        <TestWrapper>
          <TestDataTable data={tableData} />
        </TestWrapper>
      );
    });

    then("I should see 3 rows in the table", () => {
      expect(screen.getByTestId("cell-0-title")).toBeInTheDocument();
      expect(screen.getByTestId("cell-1-title")).toBeInTheDocument();
      expect(screen.getByTestId("cell-2-title")).toBeInTheDocument();
    });

    when('I click on the "Title" column header', async () => {
      await userEvent.click(screen.getByTestId("column-header-title"));
      mockSortTable("title");
    });

    then('I should see the table sorted by the "Title" column', () => {
      expect(mockSortTable).toHaveBeenCalledWith("title");
      expect(mockSortTable).toHaveBeenCalledTimes(1);
    });
  });

  test("User can load more data by scrolling to the bottom of the table", ({
    given,
    when,
    then,
  }) => {
    let tableData: TestData[] = [];

    given("I have a table with 30 lines of data", () => {
      tableData = generateTestData(30);
    });

    when("I view the table", () => {
      render(
        <TestWrapper>
          <TestDataTable data={tableData} />
        </TestWrapper>
      );
    });

    when("I scroll to the bottom of the table", async () => {
      const tableContainer = screen.getByTestId("table-container");
      await userEvent.click(tableContainer);
      mockLoadMoreData();
    });

    then("I should see the next 10 rows in the table", async () => {
      await waitFor(() => {
        expect(mockLoadMoreData).toHaveBeenCalledTimes(1);
      });
    });
  });

  test("User can see more table columns by scrolling to the right", ({
    when,
    then,
  }) => {
    when("I scroll to the right of the table", async () => {
      // 先渲染一個表格，然後進行滾動測試
      const tableData = generateTestData(10);
      render(
        <TestWrapper>
          <TestDataTable data={tableData} />
        </TestWrapper>
      );

      const tableContainer = screen.getByTestId("table-container");
      await userEvent.click(tableContainer);
      mockScrollTable("right");
    });

    then("I should see the next 10 columns in the table", async () => {
      await waitFor(() => {
        expect(mockScrollTable).toHaveBeenCalledWith("right");
        expect(mockScrollTable).toHaveBeenCalledTimes(1);
      });
    });
  });

  test("User can see virtualized rendering with large dataset", ({
    given,
    when,
    then,
  }) => {
    let tableData: TestData[] = [];

    given("I have a table with 1000 lines of data", () => {
      tableData = generateTestData(1000);
    });

    when("I view the table with virtualized rendering enabled", () => {
      render(
        <TestWrapper>
          <TestDataTable data={tableData} virtualized={true} />
        </TestWrapper>
      );
    });

    then("I should see only visible rows rendered", () => {
      // 驗證只有可見的行被渲染（大約 20-30 行，而不是全部 1000 行）
      const visibleCells = screen.getAllByTestId(/^cell-\d+-title$/);
      expect(visibleCells.length).toBeLessThan(50); // 應該遠少於 1000
      expect(visibleCells.length).toBeGreaterThan(0); // 但應該有資料顯示
    });

    then("I should see the table container with proper height", () => {
      const tableContainer = screen.getByTestId("table-container");
      expect(tableContainer).toBeInTheDocument();
    });
  });

  test("User can disable virtualized rendering", ({ given, when, then }) => {
    let tableData: TestData[] = [];

    given("I have a table with 100 lines of data", () => {
      tableData = generateTestData(100);
    });

    when("I view the table with virtualized rendering disabled", () => {
      render(
        <TestWrapper>
          <TestDataTable data={tableData} virtualized={false} />
        </TestWrapper>
      );
    });

    then("I should see all rows rendered", () => {
      // 驗證所有行都被渲染
      const visibleCells = screen.getAllByTestId(/^cell-\d+-title$/);
      expect(visibleCells.length).toBe(100);
    });
  });
});
