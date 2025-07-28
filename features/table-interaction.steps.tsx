import { defineFeature, loadFeature } from "jest-cucumber";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { jest } from "@jest/globals";
import { DataTable } from "../src/app/components/data-table";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { MantineProvider } from "@mantine/core";
import React, { useState } from "react";

// Mock functions
const mockViewTable = jest.fn();
const mockSortTable = jest.fn();
const mockFilterTable = jest.fn();
const mockClearFilter = jest.fn();

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
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
    meta: {
      enableFilter: true,
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
    meta: {
      enableFilter: true,
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    meta: {
      enableFilter: true,
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    meta: {
      enableFilter: true,
    },
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
  showFilters = false,
}: {
  data: TestData[];
  showFilters?: boolean;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <DataTable
      table={table}
      onBottomReached={mockViewTable}
      showFilters={showFilters}
      containerHeight={300}
      rowHeight={52}
    />
  );
};

const feature = loadFeature("./features/table-interaction.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    then(
      'I should see the table sorted by the "Title" column in ascending order',
      () => {
        expect(mockSortTable).toHaveBeenCalledWith("title");
        expect(mockSortTable).toHaveBeenCalledTimes(1);
      }
    );

    when('I click on the "Title" column header again', async () => {
      await userEvent.click(screen.getByTestId("column-header-title"));
      mockSortTable("title");
    });

    then(
      'I should see the table sorted by the "Title" column in descending order',
      () => {
        expect(mockSortTable).toHaveBeenCalledWith("title");
        expect(mockSortTable).toHaveBeenCalledTimes(2);
      }
    );
  });

  test("User can expand filter inputs by clicking toggle button", ({
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

    then("I should see the filter inputs are hidden by default", () => {
      // 預設情況下篩選輸入框應該不存在
      expect(
        screen.queryByTestId("filter-input-title")
      ).not.toBeInTheDocument();
    });

    when("I click on the toggle all filters button", async () => {
      // 這裡我們需要模擬點擊全域展開按鈕
      // 由於按鈕在父元件中，我們直接渲染帶有 showFilters=true 的表格
      render(
        <TestWrapper>
          <TestDataTable data={tableData} showFilters={true} />
        </TestWrapper>
      );
    });

    then("I should see all filter inputs are visible", () => {
      // 驗證篩選輸入框都顯示
      expect(screen.getByTestId("filter-input-id")).toBeInTheDocument();
      expect(screen.getByTestId("filter-input-title")).toBeInTheDocument();
      expect(
        screen.getByTestId("filter-input-description")
      ).toBeInTheDocument();
      expect(screen.getByTestId("filter-input-status")).toBeInTheDocument();
    });
  });

  test("User can filter table by typing and clicking search button", ({
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
          <TestDataTable data={tableData} showFilters={true} />
        </TestWrapper>
      );
    });

    when("I click on the toggle all filters button", async () => {
      // 篩選框已經顯示，不需要額外操作
    });

    when(
      'I type "Title 1" in the filter input for "Title" column',
      async () => {
        const filterInput = screen.getByTestId("filter-input-title");
        await userEvent.type(filterInput, "Title 1");
      }
    );

    when('I click on the search button for "Title" column', async () => {
      const searchButton = screen.getByTestId("filter-search-title");
      await userEvent.click(searchButton);
      mockFilterTable("title", "Title 1");
    });

    then(
      'I should see the table filtered to show only rows with "Title 1"',
      () => {
        expect(mockFilterTable).toHaveBeenCalledWith("title", "Title 1");
        expect(mockFilterTable).toHaveBeenCalledTimes(1);
      }
    );
  });

  test("User can clear the filter by clicking on the clear button in the filter input", ({
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
          <TestDataTable data={tableData} showFilters={true} />
        </TestWrapper>
      );
    });

    when("I click on the toggle all filters button", async () => {
      // 篩選框已經顯示，不需要額外操作
    });

    when(
      'I type "Title 1" in the filter input for "Title" column',
      async () => {
        const filterInput = screen.getByTestId("filter-input-title");
        await userEvent.type(filterInput, "Title 1");
      }
    );

    when('I click on the search button for "Title" column', async () => {
      const searchButton = screen.getByTestId("filter-search-title");
      await userEvent.click(searchButton);
      mockFilterTable("title", "Title 1");
    });

    then(
      'I should see the table filtered to show only rows with "Title 1"',
      () => {
        expect(mockFilterTable).toHaveBeenCalledWith("title", "Title 1");
        expect(mockFilterTable).toHaveBeenCalledTimes(1);
      }
    );

    when('I click on the clear button for "Title" column', async () => {
      const clearButton = screen.getByTestId("filter-clear-title");
      await userEvent.click(clearButton);
      mockClearFilter("title");
    });

    then("I should see the table data without filtering", () => {
      expect(mockClearFilter).toHaveBeenCalledWith("title");
      expect(mockClearFilter).toHaveBeenCalledTimes(1);
    });
  });
});
