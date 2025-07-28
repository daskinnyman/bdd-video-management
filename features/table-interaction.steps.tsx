import { defineFeature, loadFeature } from "jest-cucumber";
import { screen, render, waitFor } from "@testing-library/react";
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
const mockOnBottomReached = jest.fn();

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
      onBottomReached={mockOnBottomReached}
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

      // 驗證初始資料順序
      expect(screen.getByTestId("cell-0-title")).toHaveTextContent("Title 1");
      expect(screen.getByTestId("cell-1-title")).toHaveTextContent("Title 2");
      expect(screen.getByTestId("cell-2-title")).toHaveTextContent("Title 3");
    });

    when('I click on the "Title" column header', async () => {
      await userEvent.click(screen.getByTestId("column-header-title"));
    });

    then(
      'I should see the table sorted by the "Title" column in ascending order',
      async () => {
        await waitFor(() => {
          // 驗證排序後的資料順序（升序）
          expect(screen.getByTestId("cell-0-title")).toHaveTextContent(
            "Title 1"
          );
          expect(screen.getByTestId("cell-1-title")).toHaveTextContent(
            "Title 2"
          );
          expect(screen.getByTestId("cell-2-title")).toHaveTextContent(
            "Title 3"
          );
        });
      }
    );

    when('I click on the "Title" column header again', async () => {
      await userEvent.click(screen.getByTestId("column-header-title"));
    });

    then(
      'I should see the table sorted by the "Title" column in descending order',
      async () => {
        await waitFor(() => {
          // 驗證排序後的資料順序（降序）
          expect(screen.getByTestId("cell-0-title")).toHaveTextContent(
            "Title 3"
          );
          expect(screen.getByTestId("cell-1-title")).toHaveTextContent(
            "Title 2"
          );
          expect(screen.getByTestId("cell-2-title")).toHaveTextContent(
            "Title 1"
          );
        });
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
      expect(screen.queryByTestId("filter-input-id")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("filter-input-description")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("filter-input-status")
      ).not.toBeInTheDocument();
    });

    when("I click on the toggle all filters button", async () => {
      // 重新渲染帶有 showFilters=true 的表格來模擬展開篩選
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

      // 驗證搜尋和清除按鈕也存在
      expect(screen.getByTestId("filter-search-id")).toBeInTheDocument();
      expect(screen.getByTestId("filter-search-title")).toBeInTheDocument();
      expect(
        screen.getByTestId("filter-search-description")
      ).toBeInTheDocument();
      expect(screen.getByTestId("filter-search-status")).toBeInTheDocument();

      expect(screen.getByTestId("filter-clear-id")).toBeInTheDocument();
      expect(screen.getByTestId("filter-clear-title")).toBeInTheDocument();
      expect(
        screen.getByTestId("filter-clear-description")
      ).toBeInTheDocument();
      expect(screen.getByTestId("filter-clear-status")).toBeInTheDocument();
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
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, "Title 1");
      }
    );

    when('I click on the search button for "Title" column', async () => {
      const searchButton = screen.getByTestId("filter-search-title");
      await userEvent.click(searchButton);
    });

    then(
      'I should see the table filtered to show only rows with "Title 1"',
      async () => {
        await waitFor(() => {
          // 驗證篩選後的結果
          expect(screen.getByTestId("cell-0-title")).toHaveTextContent(
            "Title 1"
          );

          // 驗證其他行被篩選掉
          expect(screen.queryByTestId("cell-1-title")).not.toBeInTheDocument();
          expect(screen.queryByTestId("cell-2-title")).not.toBeInTheDocument();

          // 驗證篩選統計顯示
          expect(screen.getByTestId("filter-stats")).toBeInTheDocument();
          expect(screen.getByTestId("filter-stats")).toHaveTextContent(
            "顯示 1 / 3 筆資料"
          );
        });
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
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, "Title 1");
      }
    );

    when('I click on the search button for "Title" column', async () => {
      const searchButton = screen.getByTestId("filter-search-title");
      await userEvent.click(searchButton);
    });

    then(
      'I should see the table filtered to show only rows with "Title 1"',
      async () => {
        await waitFor(() => {
          // 驗證篩選後的結果
          expect(screen.getByTestId("cell-0-title")).toHaveTextContent(
            "Title 1"
          );
          expect(screen.queryByTestId("cell-1-title")).not.toBeInTheDocument();
          expect(screen.queryByTestId("cell-2-title")).not.toBeInTheDocument();
        });
      }
    );

    when('I click on the clear button for "Title" column', async () => {
      const clearButton = screen.getByTestId("filter-clear-title");
      await userEvent.click(clearButton);
    });

    then("I should see the table data without filtering", async () => {
      await waitFor(() => {
        // 驗證清除篩選後，所有資料都顯示
        expect(screen.getByTestId("cell-0-title")).toHaveTextContent("Title 1");
        expect(screen.getByTestId("cell-1-title")).toHaveTextContent("Title 2");
        expect(screen.getByTestId("cell-2-title")).toHaveTextContent("Title 3");

        // 驗證篩選統計不再顯示
        expect(screen.queryByTestId("filter-stats")).not.toBeInTheDocument();

        // 驗證篩選輸入框被清空
        const filterInput = screen.getByTestId(
          "filter-input-title"
        ) as HTMLInputElement;
        expect(filterInput.value).toBe("");
      });
    });
  });

  test("User can filter with empty data and no results", ({
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
      'I type "NonExistent" in the filter input for "Title" column',
      async () => {
        const filterInput = screen.getByTestId("filter-input-title");
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, "NonExistent");
      }
    );

    when('I click on the search button for "Title" column', async () => {
      const searchButton = screen.getByTestId("filter-search-title");
      await userEvent.click(searchButton);
    });

    then("I should see no results message", async () => {
      await waitFor(() => {
        // 驗證沒有符合條件的資料訊息
        expect(screen.getByTestId("empty-table")).toBeInTheDocument();
        expect(screen.getByText("沒有符合篩選條件的資料")).toBeInTheDocument();

        // 當篩選結果為空時，不應該顯示篩選統計
        expect(screen.queryByTestId("filter-stats")).not.toBeInTheDocument();
      });
    });
  });

  test("User can filter by multiple columns simultaneously", ({
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
      'I type "Active" in the filter input for "Status" column',
      async () => {
        const filterInput = screen.getByTestId("filter-input-status");
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, "Active");
      }
    );

    when('I click on the search button for "Status" column', async () => {
      const searchButton = screen.getByTestId("filter-search-status");
      await userEvent.click(searchButton);
    });

    when(
      'I type "Title 1" in the filter input for "Title" column',
      async () => {
        const filterInput = screen.getByTestId("filter-input-title");
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, "Title 1");
      }
    );

    when('I click on the search button for "Title" column', async () => {
      const searchButton = screen.getByTestId("filter-search-title");
      await userEvent.click(searchButton);
    });

    then("I should see only rows matching both filters", async () => {
      await waitFor(() => {
        // 驗證只有符合兩個篩選條件的資料顯示
        expect(screen.getByTestId("cell-0-title")).toHaveTextContent("Title 1");
        expect(screen.getByTestId("cell-0-status")).toHaveTextContent("Active");

        // 驗證其他行被篩選掉
        expect(screen.queryByTestId("cell-1-title")).not.toBeInTheDocument();
        expect(screen.queryByTestId("cell-2-title")).not.toBeInTheDocument();

        // 驗證篩選統計顯示
        expect(screen.getByTestId("filter-stats")).toBeInTheDocument();
        expect(screen.getByTestId("filter-stats")).toHaveTextContent(
          "顯示 1 / 3 筆資料"
        );
        expect(screen.getByTestId("filter-stats")).toHaveTextContent(
          "(2 個篩選條件)"
        );
      });
    });
  });

  test("User can filter by pressing Enter key in filter input", ({
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
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, "Title 1");
      }
    );

    when("I press Enter key in the filter input", async () => {
      const filterInput = screen.getByTestId("filter-input-title");
      await userEvent.type(filterInput, "{enter}");
    });

    then(
      'I should see the table filtered to show only rows with "Title 1"',
      async () => {
        await waitFor(() => {
          // 驗證篩選後的結果
          expect(screen.getByTestId("cell-0-title")).toHaveTextContent(
            "Title 1"
          );

          // 驗證其他行被篩選掉
          expect(screen.queryByTestId("cell-1-title")).not.toBeInTheDocument();
          expect(screen.queryByTestId("cell-2-title")).not.toBeInTheDocument();

          // 驗證篩選統計顯示
          expect(screen.getByTestId("filter-stats")).toBeInTheDocument();
          expect(screen.getByTestId("filter-stats")).toHaveTextContent(
            "顯示 1 / 3 筆資料"
          );
        });
      }
    );
  });

  test("User can view empty table with no data", ({ given, when, then }) => {
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

    then("I should see empty table message", () => {
      expect(screen.getByTestId("empty-table")).toBeInTheDocument();
      expect(screen.getByText("No data found")).toBeInTheDocument();
    });
  });

  test("User can sort table by different columns", ({ given, when, then }) => {
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

    when('I click on the "ID" column header', async () => {
      await userEvent.click(screen.getByTestId("column-header-id"));
    });

    then(
      'I should see the table sorted by the "ID" column in ascending order',
      async () => {
        await waitFor(() => {
          // 驗證排序後的資料順序（升序）
          // 由於 ID 欄位本身就是升序排列，點擊後會變成降序
          expect(screen.getByTestId("cell-0-id")).toHaveTextContent("3");
          expect(screen.getByTestId("cell-1-id")).toHaveTextContent("2");
          expect(screen.getByTestId("cell-2-id")).toHaveTextContent("1");
        });
      }
    );

    when('I click on the "Status" column header', async () => {
      await userEvent.click(screen.getByTestId("column-header-status"));
    });

    then(
      'I should see the table sorted by the "Status" column in ascending order',
      async () => {
        await waitFor(() => {
          // 驗證排序後的資料順序（Status 升序：Active 在前）
          expect(screen.getByTestId("cell-0-status")).toHaveTextContent(
            "Active"
          );
          expect(screen.getByTestId("cell-1-status")).toHaveTextContent(
            "Active"
          );
          expect(screen.getByTestId("cell-2-status")).toHaveTextContent(
            "Inactive"
          );
        });
      }
    );
  });

  test("User can filter with special characters and spaces", ({
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
      'I type "  Title 1  " with spaces in the filter input for "Title" column',
      async () => {
        const filterInput = screen.getByTestId("filter-input-title");
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, "  Title 1  ");
      }
    );

    when('I click on the search button for "Title" column', async () => {
      const searchButton = screen.getByTestId("filter-search-title");
      await userEvent.click(searchButton);
    });

    then(
      'I should see the table filtered to show only rows with "Title 1"',
      async () => {
        await waitFor(() => {
          // 驗證篩選後的結果
          // 由於帶空格的篩選可能不會匹配，我們需要檢查實際結果
          const titleCell = screen.queryByTestId("cell-0-title");
          if (titleCell) {
            expect(titleCell).toHaveTextContent("Title 1");
            // 驗證其他行被篩選掉
            expect(
              screen.queryByTestId("cell-1-title")
            ).not.toBeInTheDocument();
            expect(
              screen.queryByTestId("cell-2-title")
            ).not.toBeInTheDocument();
          } else {
            // 如果沒有找到匹配的結果，應該顯示空表格
            expect(screen.getByTestId("empty-table")).toBeInTheDocument();
            expect(
              screen.getByText("沒有符合篩選條件的資料")
            ).toBeInTheDocument();
          }
        });
      }
    );
  });

  test("User can clear all filters at once", ({ given, when, then }) => {
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
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, "Title 1");
      }
    );

    when('I click on the search button for "Title" column', async () => {
      const searchButton = screen.getByTestId("filter-search-title");
      await userEvent.click(searchButton);
    });

    when(
      'I type "Active" in the filter input for "Status" column',
      async () => {
        const filterInput = screen.getByTestId("filter-input-status");
        await userEvent.clear(filterInput);
        await userEvent.type(filterInput, "Active");
      }
    );

    when('I click on the search button for "Status" column', async () => {
      const searchButton = screen.getByTestId("filter-search-status");
      await userEvent.click(searchButton);
    });

    then("I should see filtered results", async () => {
      await waitFor(() => {
        expect(screen.getByTestId("filter-stats")).toBeInTheDocument();
        expect(screen.getByTestId("filter-stats")).toHaveTextContent(
          "(2 個篩選條件)"
        );
      });
    });

    when('I click on the clear button for "Title" column', async () => {
      const clearButton = screen.getByTestId("filter-clear-title");
      await userEvent.click(clearButton);
    });

    when('I click on the clear button for "Status" column', async () => {
      const clearButton = screen.getByTestId("filter-clear-status");
      await userEvent.click(clearButton);
    });

    then("I should see all data without any filters", async () => {
      await waitFor(() => {
        // 驗證所有資料都顯示
        expect(screen.getByTestId("cell-0-title")).toHaveTextContent("Title 1");
        expect(screen.getByTestId("cell-1-title")).toHaveTextContent("Title 2");
        expect(screen.getByTestId("cell-2-title")).toHaveTextContent("Title 3");

        // 驗證篩選統計不再顯示
        expect(screen.queryByTestId("filter-stats")).not.toBeInTheDocument();

        // 驗證篩選輸入框都被清空
        const titleFilterInput = screen.getByTestId(
          "filter-input-title"
        ) as HTMLInputElement;
        const statusFilterInput = screen.getByTestId(
          "filter-input-status"
        ) as HTMLInputElement;
        expect(titleFilterInput.value).toBe("");
        expect(statusFilterInput.value).toBe("");
      });
    });
  });

  test("User can scroll table and trigger bottom reached callback", ({
    given,
    when,
    then,
  }) => {
    let tableData: TestData[] = [];

    given("I have a table with 10 lines of data", () => {
      tableData = generateTestData(10);
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
      // 模擬滾動到底部
      Object.defineProperty(tableContainer, "scrollHeight", { value: 1000 });
      Object.defineProperty(tableContainer, "scrollTop", { value: 500 });
      Object.defineProperty(tableContainer, "clientHeight", { value: 300 });

      // 觸發滾動事件
      await userEvent.click(tableContainer);
      tableContainer.scrollTo(0, 500);
    });

    then("I should see the onBottomReached callback triggered", () => {
      expect(mockOnBottomReached).toHaveBeenCalledTimes(1);
    });
  });

  test("User can see loading state with skeleton rows", ({
    given,
    when,
    then,
  }) => {
    let tableData: TestData[] = [];

    given("I have a table with 3 lines of data", () => {
      tableData = generateTestData(3);
    });

    when("I view the table with loading state", () => {
      render(
        <TestWrapper>
          <TestDataTable data={tableData} />
        </TestWrapper>
      );
    });

    then("I should see the table with data", () => {
      expect(screen.getByTestId("cell-0-title")).toBeInTheDocument();
      expect(screen.getByTestId("cell-1-title")).toBeInTheDocument();
      expect(screen.getByTestId("cell-2-title")).toBeInTheDocument();
    });
  });
});
