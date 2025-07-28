"use client";

import React, {
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  Table,
  Skeleton,
  Text,
  Group,
  Box,
  TextInput,
  ActionIcon,
  Stack,
} from "@mantine/core";
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
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";

type DataTableProps<TData> = {
  table: TanstackTable<TData>;
  onBottomReached?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  containerHeight?: number;
  rowHeight?: number;
  virtualized?: boolean;
  showFilters?: boolean;
};

export function DataTable<TData>({
  table,
  onBottomReached,
  isLoading = false,
  emptyMessage = "No data found",
  containerHeight = 400,
  rowHeight = 52,
  virtualized = true,
  showFilters = false,
}: DataTableProps<TData>) {
  const { rows } = table.getRowModel();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);
  const previousFilterCountRef = useRef(0);

  // 確保只在客戶端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 同步篩選值與表格狀態
  useEffect(() => {
    const newFilterValues: Record<string, string> = {};
    table.getAllColumns().forEach((column) => {
      const filterValue = column.getFilterValue() as string;
      if (filterValue) {
        newFilterValues[column.id] = filterValue;
      }
    });

    const currentFilterCount = Object.keys(newFilterValues).length;
    const previousFilterCount = previousFilterCountRef.current;

    setFilterValues(newFilterValues);

    // 如果篩選數量從有變無，重置滾動位置
    if (
      previousFilterCount > 0 &&
      currentFilterCount === 0 &&
      isClient &&
      tableContainerRef.current
    ) {
      tableContainerRef.current.scrollTop = 0;
    }

    // 更新前一個篩選數量
    previousFilterCountRef.current = currentFilterCount;
  }, [table.getState().columnFilters, isClient]);

  // 當 showFilters 改變時，重置篩選值
  useEffect(() => {
    if (!showFilters) {
      setFilterValues({});
      // 清除所有篩選
      table.getAllColumns().forEach((column) => {
        column.setFilterValue(undefined);
      });

      // 重置表格滾動到最頂端
      if (isClient && tableContainerRef.current) {
        tableContainerRef.current.scrollTop = 0;
      }
    }
  }, [showFilters, table, isClient]);

  // 監聽容器寬度變化
  useLayoutEffect(() => {
    if (!tableContainerRef.current || !isClient) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(tableContainerRef.current);

    // 初始化時設定寬度
    setContainerWidth(tableContainerRef.current.clientWidth);

    return () => resizeObserver.disconnect();
  }, [isClient]);

  // 計算動態表格樣式
  const tableStyle = useMemo(() => {
    // 在伺服器端或客戶端未準備好時，使用預設樣式
    if (!isClient || containerWidth === 0) {
      return { width: "100%" };
    }

    const totalColumnWidth = table
      .getAllColumns()
      .reduce((sum, col) => sum + (col.getSize() || 120), 0);

    // 如果總欄寬大於實際容器寬度，啟用水平滾動；否則填滿容器
    return totalColumnWidth > containerWidth
      ? { minWidth: "max-content", width: "100%" }
      : { width: "100%" };
  }, [containerWidth, isClient]);

  // 計算欄位寬度樣式
  const getColumnStyle = useCallback(
    (column: Column<TData, unknown>) => {
      const baseStyle = {
        padding: "12px 8px",
        whiteSpace: "nowrap" as const,
        overflow: "hidden" as const,
        textOverflow: "ellipsis" as const,
      };

      // 在伺服器端或客戶端未準備好時，使用預設寬度
      if (!isClient || containerWidth === 0) {
        return {
          ...baseStyle,
          width: column.getSize() || 120,
          minWidth: column.getSize() || 120,
          maxWidth: column.getSize() || 120,
        };
      }

      const totalColumnWidth = table
        .getAllColumns()
        .reduce((sum, col) => sum + (col.getSize() || 120), 0);

      // 如果總欄寬小於實際容器寬度，讓欄位平均分配
      if (totalColumnWidth <= containerWidth) {
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
    [containerWidth, isClient]
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

  // 篩選功能
  const handleFilterChange = (columnId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [columnId]: value }));
  };

  const handleSearch = (columnId: string) => {
    const value = filterValues[columnId] || "";
    table.getColumn(columnId)?.setFilterValue(value);
  };

  const handleClear = (columnId: string) => {
    setFilterValues((prev) => ({ ...prev, [columnId]: "" }));
    table.getColumn(columnId)?.setFilterValue(undefined);
  };

  const renderFilterInput = (column: Column<TData, unknown>) => {
    const meta = column.columnDef.meta as
      | { enableFilter?: boolean }
      | undefined;
    const canFilter = meta?.enableFilter;
    if (!canFilter || !showFilters) return null;

    const columnId = column.id;
    const value = filterValues[columnId] || "";
    const hasFilter = value.length > 0;

    return (
      <Stack gap="xs" mt="xs" style={{ minHeight: "60px" }}>
        <Group gap="xs" style={{ height: "32px" }}>
          <TextInput
            size="xs"
            placeholder={`篩選 ${column.columnDef.header as string}`}
            value={value}
            onChange={(e) => handleFilterChange(columnId, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch(columnId);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            data-testid={`filter-input-${columnId}`}
            style={{
              flex: 1,
              height: "28px",
              minHeight: "28px",
              borderColor: hasFilter
                ? "var(--mantine-color-blue-6)"
                : undefined,
              backgroundColor: hasFilter
                ? "var(--mantine-color-blue-0)"
                : undefined,
            }}
          />
          <ActionIcon
            size="xs"
            variant={hasFilter ? "filled" : "light"}
            color={hasFilter ? "blue" : "gray"}
            onClick={(e) => {
              e.stopPropagation();
              handleSearch(columnId);
            }}
            data-testid={`filter-search-${columnId}`}
            style={{ height: "28px", width: "28px" }}
          >
            <IconSearch size={12} />
          </ActionIcon>
          <ActionIcon
            size="xs"
            variant="light"
            onClick={(e) => {
              e.stopPropagation();
              handleClear(columnId);
            }}
            data-testid={`filter-clear-${columnId}`}
            style={{ height: "28px", width: "28px" }}
          >
            <IconX size={12} />
          </ActionIcon>
        </Group>
      </Stack>
    );
  };

  // 計算篩選統計
  const filterStats = useMemo(() => {
    const totalRows = table.getPreFilteredRowModel().rows.length;
    const filteredRows = rows.length;
    const activeFilters = Object.values(filterValues).filter(
      (v) => v.length > 0
    ).length;

    return {
      totalRows,
      filteredRows,
      activeFilters,
      hasActiveFilters: activeFilters > 0,
    };
  }, [rows.length, filterValues]);

  // 虛擬化滾動處理
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement && onBottomReached) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // 當使用者滾動到距離底部 500px 時觸發載入更多資料
        // 在篩選狀態下也允許載入更多資料，但需要確保篩選條件保持
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
      isClient && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 10, // 增加 overscan 以改善滾動體驗
    scrollPaddingEnd: 100, // 添加滾動底部填充
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // 當篩選改變時，重置虛擬化器的滾動位置並重新計算
  useEffect(() => {
    if (isClient) {
      // 重置表格滾動到最頂端
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTop = 0;
      }

      // 如果是虛擬化模式，也重置虛擬化器
      if (rowVirtualizer) {
        rowVirtualizer.scrollToIndex(0);
        // 強制重新計算虛擬化器
        rowVirtualizer.measure();
      }
    }
  }, [table.getState().columnFilters, isClient]);

  // 當篩選結果為空時，也重置滾動位置
  useEffect(() => {
    const activeFilters = Object.values(filterValues).filter(
      (v) => v.length > 0
    ).length;

    if (isClient && activeFilters > 0 && rows.length === 0) {
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTop = 0;
      }

      if (rowVirtualizer) {
        rowVirtualizer.scrollToIndex(0);
      }
    }
  }, [filterValues, rows.length, isClient]);

  // 當資料變化時，重新計算虛擬化器
  useEffect(() => {
    if (isClient && rowVirtualizer) {
      // 延遲重新計算，確保 DOM 已更新
      const timer = setTimeout(() => {
        rowVirtualizer.measure();
        // 如果當前滾動位置接近底部，自動滾動到底部以顯示新資料
        if (tableContainerRef.current) {
          const { scrollHeight, scrollTop, clientHeight } =
            tableContainerRef.current;
          if (scrollHeight - scrollTop - clientHeight < 200) {
            tableContainerRef.current.scrollTop = scrollHeight;
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [rows.length, isClient]);

  // 當載入狀態改變時，重新計算虛擬化器
  useEffect(() => {
    if (isClient && rowVirtualizer) {
      // 延遲重新計算，確保載入狀態已更新
      setTimeout(() => {
        rowVirtualizer.measure();
      }, 100);
    }
  }, [isLoading, isClient]);

  // 在伺服器端或客戶端未準備好時，使用非虛擬化模式
  const shouldUseVirtualization = virtualized && isClient && containerWidth > 0;

  // 當篩選後的資料很少時，禁用虛擬化以避免渲染問題
  const shouldDisableVirtualization =
    rows.length <= 10 || !shouldUseVirtualization;

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
          {filterStats.hasActiveFilters
            ? "沒有符合篩選條件的資料"
            : emptyMessage}
        </Text>
      </Box>
    );
  }

  if (shouldDisableVirtualization) {
    // 非虛擬化模式
    return (
      <Box style={{ height: containerHeight, width: "100%" }}>
        {/* 篩選統計顯示 */}
        {showFilters && filterStats.hasActiveFilters && (
          <Box
            style={{
              padding: "8px 12px",
              backgroundColor: "var(--mantine-color-blue-0)",
              borderBottom: "1px solid var(--mantine-color-gray-3)",
              fontSize: "12px",
              color: "var(--mantine-color-blue-7)",
            }}
            data-testid="filter-stats"
          >
            顯示 {filterStats.filteredRows} / {filterStats.totalRows} 筆資料
            {filterStats.activeFilters > 0 &&
              ` (${filterStats.activeFilters} 個篩選條件)`}
          </Box>
        )}

        <Box
          ref={tableContainerRef}
          style={{
            height:
              showFilters && filterStats.hasActiveFilters
                ? `calc(100% - 40px)`
                : "100%",
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
                  <tr
                    key={headerGroup.id}
                    style={{
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    {headerGroup.headers.map(
                      (header: Header<TData, unknown>) => (
                        <th
                          key={header.id}
                          data-testid={`column-header-${header.column.id}`}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            ...getColumnStyle(header.column),
                            cursor: header.column.getCanSort()
                              ? "pointer"
                              : "default",
                            userSelect: "none",
                            minHeight: showFilters ? "100px" : "auto",
                            height: showFilters ? "100px" : "auto",
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <Group
                            gap="xs"
                            justify="space-between"
                            style={{
                              width: "100%",
                              height: showFilters ? "32px" : "auto",
                              minHeight: showFilters ? "32px" : "auto",
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {renderSortIcon(header.column)}
                          </Group>
                          {renderFilterInput(header.column)}
                        </th>
                      )
                    )}
                  </tr>
                ))}
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row: Row<TData>, index: number) => (
                <tr
                  key={row.id}
                  data-testid={`row-${index}`}
                  style={{
                    display: "flex",
                    width: "100%",
                    height: `${rowHeight}px`,
                    minHeight: `${rowHeight}px`,
                  }}
                >
                  {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                    <td
                      key={cell.id}
                      data-testid={`cell-${index}-${cell.column.id}`}
                      style={{
                        display: "flex",
                        ...getColumnStyle(cell.column),
                        height: `${rowHeight}px`,
                        minHeight: `${rowHeight}px`,
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
            </Table.Tbody>
          </Table>
        </Box>
      </Box>
    );
  }

  // 虛擬化模式
  return (
    <Box style={{ height: containerHeight, width: "100%" }}>
      {/* 篩選統計顯示 */}
      {showFilters && filterStats.hasActiveFilters && (
        <Box
          style={{
            padding: "8px 12px",
            backgroundColor: "var(--mantine-color-blue-0)",
            borderBottom: "1px solid var(--mantine-color-gray-3)",
            fontSize: "12px",
            color: "var(--mantine-color-blue-7)",
          }}
          data-testid="filter-stats"
        >
          顯示 {filterStats.filteredRows} / {filterStats.totalRows} 筆資料
          {filterStats.activeFilters > 0 &&
            ` (${filterStats.activeFilters} 個篩選條件)`}
        </Box>
      )}

      <Box
        ref={tableContainerRef}
        style={{
          height:
            showFilters && filterStats.hasActiveFilters
              ? `calc(100% - 40px)`
              : "100%",
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
                      flexDirection: "column",
                      ...getColumnStyle(header.column),
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      userSelect: "none",
                      minHeight: showFilters ? "100px" : "auto",
                      height: showFilters ? "100px" : "auto",
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Group
                      gap="xs"
                      justify="space-between"
                      style={{
                        width: "100%",
                        height: showFilters ? "32px" : "auto",
                        minHeight: showFilters ? "32px" : "auto",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {renderSortIcon(header.column)}
                    </Group>
                    {renderFilterInput(header.column)}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              display: "grid",
              height: `${
                totalSize +
                (isLoading && !filterStats.hasActiveFilters ? 3 * rowHeight : 0)
              }px`,
              position: "relative",
            }}
          >
            {virtualItems.length > 0
              ? virtualItems.map((virtualRow: VirtualItem) => {
                  const row = rows[virtualRow.index] as Row<TData>;
                  if (!row) return null; // 防止 undefined row

                  return (
                    <tr
                      key={`${row.id}-${virtualRow.index}`}
                      data-testid={`virtual-row-${virtualRow.index}`}
                      style={{
                        display: "flex",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                        height: `${virtualRow.size}px`,
                        minHeight: `${virtualRow.size}px`,
                      }}
                    >
                      {row
                        .getVisibleCells()
                        .map((cell: Cell<TData, unknown>) => (
                          <td
                            key={`${cell.id}-${virtualRow.index}`}
                            data-testid={`cell-${virtualRow.index}-${cell.column.id}`}
                            style={{
                              display: "flex",
                              ...getColumnStyle(cell.column),
                              height: `${virtualRow.size}px`,
                              minHeight: `${virtualRow.size}px`,
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
                    key={`${row.id}-fallback-${index}`}
                    data-testid={`fallback-row-${index}`}
                    style={{
                      display: "flex",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${index * rowHeight}px)`,
                      height: `${rowHeight}px`,
                      minHeight: `${rowHeight}px`,
                    }}
                  >
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                      <td
                        key={`${cell.id}-fallback-${index}`}
                        data-testid={`cell-${index}-${cell.column.id}`}
                        style={{
                          display: "flex",
                          ...getColumnStyle(cell.column),
                          height: `${rowHeight}px`,
                          minHeight: `${rowHeight}px`,
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
              isClient &&
              virtualItems.length > 0 &&
              !filterStats.hasActiveFilters && // 在篩選時不顯示骨架屏
              Array.from({ length: 3 }).map((_, idx) => (
                <tr
                  key={`skeleton-${idx}-virtual`}
                  style={{
                    display: "flex",
                    width: "100%",
                    position: "absolute",
                    top:
                      (virtualItems[virtualItems.length - 1]?.end ?? 0) +
                      idx * rowHeight,
                    left: 0,
                    height: `${rowHeight}px`,
                    minHeight: `${rowHeight}px`,
                  }}
                >
                  {table.getAllColumns().map((column, colIndex) => (
                    <td
                      key={`skeleton-${idx}-${colIndex}-virtual`}
                      style={{
                        display: "flex",
                        ...getColumnStyle(column),
                        height: `${rowHeight}px`,
                        minHeight: `${rowHeight}px`,
                      }}
                    >
                      <Skeleton height={20} style={{ width: "100%" }} />
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>

        {/* 載入中的骨架屏 - 只在客戶端顯示且沒有篩選時 */}
        {isLoading && isClient && !filterStats.hasActiveFilters && (
          <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
            {Array.from({ length: 3 }, (_, index) => (
              <tr
                key={`skeleton-${index}-bottom`}
                style={{
                  display: "flex",
                  width: "100%",
                  height: `${rowHeight}px`,
                  minHeight: `${rowHeight}px`,
                }}
              >
                {table.getAllColumns().map((column, colIndex) => (
                  <td
                    key={`skeleton-${index}-${colIndex}-bottom`}
                    style={{
                      display: "flex",
                      ...getColumnStyle(column),
                      height: `${rowHeight}px`,
                      minHeight: `${rowHeight}px`,
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
