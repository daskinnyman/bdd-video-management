"use client";

import React, {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Table, Skeleton, Text, Group, Box } from "@mantine/core";
import {
  flexRender,
  Table as TanstackTable,
  Column,
  HeaderGroup,
  Header,
  Cell,
  Row,
} from "@tanstack/react-table";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
} from "@tabler/icons-react";
import { useVirtualizer } from "@tanstack/react-virtual";

type DataTableProps<TData> = {
  table: TanstackTable<TData>;
  onBottomReached?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  containerHeight?: number;
  rowHeight?: number;
  virtualized?: boolean;
};

export function DataTable<TData>({
  table,
  onBottomReached,
  isLoading = false,
  emptyMessage = "No data found",
  containerHeight = 400,
  rowHeight = 52,
  virtualized = true,
}: DataTableProps<TData>) {
  const { rows } = table.getRowModel();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // 監聽容器寬度變化
  useEffect(() => {
    if (!tableContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(tableContainerRef.current);

    // 初始化時設定寬度
    setContainerWidth(tableContainerRef.current.clientWidth);

    return () => resizeObserver.disconnect();
  }, []);

  // 計算動態表格樣式
  const tableStyle = useMemo(() => {
    const totalColumnWidth = table
      .getAllColumns()
      .reduce((sum, col) => sum + (col.getSize() || 120), 0);

    // 如果總欄寬大於實際容器寬度，啟用水平滾動；否則填滿容器
    return totalColumnWidth > containerWidth && containerWidth > 0
      ? { minWidth: "max-content", width: "100%" }
      : { width: "100%" };
  }, [table, containerWidth]);

  // 計算欄位寬度樣式
  const getColumnStyle = useCallback(
    (column: Column<TData, unknown>) => {
      const totalColumnWidth = table
        .getAllColumns()
        .reduce((sum, col) => sum + (col.getSize() || 120), 0);

      const baseStyle = {
        padding: "12px 8px",
        whiteSpace: "nowrap" as const,
        overflow: "hidden" as const,
        textOverflow: "ellipsis" as const,
      };

      // 如果總欄寬小於實際容器寬度，讓欄位平均分配
      if (totalColumnWidth <= containerWidth && containerWidth > 0) {
        const columnCount = table.getAllColumns().length;
        return {
          ...baseStyle,
          width: `${100 / columnCount}%`,
          minWidth: `${100 / columnCount}%`,
          maxWidth: `${100 / columnCount}%`,
        };
      }

      // 否則使用原始設定的寬度
      return {
        ...baseStyle,
        width: column.getSize() || 120,
        minWidth: column.getSize() || 120,
        maxWidth: column.getSize() || 120,
      };
    },
    [table, containerWidth]
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

  // 虛擬化滾動處理
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement && onBottomReached) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // 當使用者滾動到距離底部 500px 時觸發載入更多資料
        if (scrollHeight - scrollTop - clientHeight < 500) {
          onBottomReached();
        }
      }
    },
    [onBottomReached]
  );

  // 在 mount 和資料更新後檢查是否需要載入更多資料
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached, rows.length]);

  // 建立虛擬化器
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  if (rows.length === 0 && !isLoading) {
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

  if (!virtualized) {
    // 非虛擬化模式
    return (
      <Box style={{ height: containerHeight, width: "100%" }}>
        <Box
          ref={tableContainerRef}
          style={{
            height: "100%",
            width: "100%",
            overflow: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
          }}
          onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
          data-testid="table-container"
        >
          <Table style={tableStyle}>
            <Table.Thead>
              {table
                .getHeaderGroups()
                .map((headerGroup: HeaderGroup<TData>) => (
                  <Table.Tr key={headerGroup.id}>
                    {headerGroup.headers.map(
                      (header: Header<TData, unknown>) => (
                        <Table.Th
                          key={header.id}
                          data-testid={`column-header-${header.column.id}`}
                          style={{
                            ...getColumnStyle(header.column),
                            cursor: header.column.getCanSort()
                              ? "pointer"
                              : "default",
                            userSelect: "none",
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
                      )
                    )}
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
                      style={getColumnStyle(cell.column)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
              {isLoading && (
                <>
                  {Array.from({ length: 3 }, (_, index) => (
                    <Table.Tr key={`skeleton-${index}`}>
                      {table.getAllColumns().map((column, colIndex) => (
                        <Table.Td key={colIndex} style={getColumnStyle(column)}>
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

  // 虛擬化模式
  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <Box style={{ height: containerHeight, width: "100%" }}>
      <Box
        ref={tableContainerRef}
        style={{
          height: "100%",
          width: "100%",
          overflow: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          position: "relative",
        }}
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
        data-testid="table-container"
      >
        {/* 使用 CSS Grid 和 Flexbox 來支援動態行高 */}
        <table style={{ display: "grid", width: "100%" }}>
          <thead
            style={{
              display: "grid",
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "var(--mantine-color-body)",
            }}
          >
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
              <tr
                key={headerGroup.id}
                style={{ display: "flex", width: "100%" }}
              >
                {headerGroup.headers.map((header: Header<TData, unknown>) => (
                  <th
                    key={header.id}
                    data-testid={`column-header-${header.column.id}`}
                    style={{
                      display: "flex",
                      ...getColumnStyle(header.column),
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      userSelect: "none",
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Group
                      gap="xs"
                      justify="space-between"
                      style={{ width: "100%" }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {renderSortIcon(header.column)}
                    </Group>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              display: "grid",
              height: `${totalSize + (isLoading ? 3 * rowHeight : 0)}px`,
              position: "relative",
            }}
          >
            {virtualItems.length > 0
              ? virtualItems.map((virtualRow) => {
                  const row = rows[virtualRow.index] as Row<TData>;
                  return (
                    <tr
                      key={row.id}
                      data-testid={`virtual-row-${virtualRow.index}`}
                      style={{
                        display: "flex",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {row
                        .getVisibleCells()
                        .map((cell: Cell<TData, unknown>) => (
                          <td
                            key={cell.id}
                            data-testid={`cell-${virtualRow.index}-${cell.column.id}`}
                            style={{
                              display: "flex",
                              ...getColumnStyle(cell.column),
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                    </tr>
                  );
                })
              : // 如果虛擬化器沒有項目，回退到渲染所有行
                rows.map((row: Row<TData>, index: number) => (
                  <tr
                    key={row.id}
                    data-testid={`fallback-row-${index}`}
                    style={{
                      display: "flex",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${index * rowHeight}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                      <td
                        key={cell.id}
                        data-testid={`cell-${index}-${cell.column.id}`}
                        style={{
                          display: "flex",
                          ...getColumnStyle(cell.column),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            {/* Skeleton 行顯示在可見區域底部 */}
            {isLoading &&
              virtualItems.length > 0 &&
              Array.from({ length: 3 }).map((_, idx) => (
                <tr
                  key={`skeleton-${idx}`}
                  style={{
                    display: "flex",
                    width: "100%",
                    position: "absolute",
                    top:
                      (virtualItems[virtualItems.length - 1]?.end ?? 0) +
                      idx * rowHeight,
                    left: 0,
                  }}
                >
                  {table.getAllColumns().map((column, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        display: "flex",
                        ...getColumnStyle(column),
                      }}
                    >
                      <Skeleton height={20} style={{ width: "100%" }} />
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>

        {/* 載入中的骨架屏 */}
        {isLoading && (
          <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
            {Array.from({ length: 3 }, (_, index) => (
              <tr
                key={`skeleton-${index}`}
                style={{ display: "flex", width: "100%" }}
              >
                {table.getAllColumns().map((column, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      display: "flex",
                      ...getColumnStyle(column),
                    }}
                  >
                    <Skeleton height={20} style={{ width: "100%" }} />
                  </td>
                ))}
              </tr>
            ))}
          </div>
        )}
      </Box>
    </Box>
  );
}
