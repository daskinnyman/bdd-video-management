"use client";

import React, { useCallback, useState } from "react";
import { Table, Skeleton, Text, Group, Box } from "@mantine/core";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  Row,
  Column,
  HeaderGroup,
  Header,
  Cell,
} from "@tanstack/react-table";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
} from "@tabler/icons-react";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  onBottomReached?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  containerHeight?: number;
};

export function DataTable<TData>({
  data,
  columns,
  onBottomReached,
  isLoading = false,
  emptyMessage = "No data found",
  containerHeight = 400,
}: DataTableProps<TData>) {
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

  const { rows } = table.getRowModel();

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

      // 檢查是否滾動到底部
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        onBottomReached?.();
      }
    },
    [onBottomReached]
  );

  const renderSortIcon = (column: Column<TData, unknown>) => {
    if (!column.getCanSort()) return null;

    const isSorted = column.getIsSorted();

    if (isSorted === "asc") {
      return <IconChevronUp size={16} />;
    } else if (isSorted === "desc") {
      return <IconChevronDown size={16} />;
    }

    return <IconSelector size={16} />;
  };

  if (data.length === 0 && !isLoading) {
    return (
      <Box
        style={{
          height: containerHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-testid="empty-table"
      >
        <Text size="lg" c="dimmed">
          {emptyMessage}
        </Text>
      </Box>
    );
  }

  return (
    <Box style={{ height: containerHeight, width: "100%" }}>
      <Box
        style={{
          height: "100%",
          width: "100%",
          overflow: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
        }}
        onScroll={handleScroll}
        data-testid="table-container"
      >
        <Table style={{ minWidth: "max-content", width: "100%" }}>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<TData, unknown>) => (
                  <Table.Th
                    key={header.id}
                    data-testid={`column-header-${header.column.id}`}
                    style={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      minWidth: header.column.getSize() || 120,
                      maxWidth: header.column.getSize() || 120,
                      padding: "12px 8px",
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Group gap="xs" justify="space-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {renderSortIcon(header.column)}
                    </Group>
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row: Row<TData>, index: number) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                  <Table.Td
                    key={cell.id}
                    data-testid={`cell-${index}-${cell.column.id}`}
                    style={{
                      whiteSpace: "nowrap",
                      minWidth: cell.column.getSize() || 120,
                      maxWidth: cell.column.getSize() || 120,
                      padding: "12px 8px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
            {isLoading && (
              <>
                {Array.from({ length: 3 }, (_, index) => (
                  <Table.Tr key={`skeleton-${index}`}>
                    {table.getAllColumns().map((column, colIndex) => (
                      <Table.Td key={colIndex}>
                        <Skeleton height={20} />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </>
            )}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}
