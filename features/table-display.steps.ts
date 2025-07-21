import { defineFeature, loadFeature } from "jest-cucumber";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { jest } from "@jest/globals";
import { DataTable } from "../../src/app/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

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
        <DataTable
          data={tableData}
          columns={columns}
          onBottomReached={mockViewTable}
        />
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
        <DataTable
          data={tableData}
          columns={columns}
          onBottomReached={mockViewTable}
        />
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
        <DataTable
          data={tableData}
          columns={columns}
          onBottomReached={mockViewTable}
        />
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
        <DataTable
          data={tableData}
          columns={columns}
          onBottomReached={mockLoadMoreData}
        />
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
});
