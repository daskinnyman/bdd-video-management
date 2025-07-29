"use client";

import React, { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Text, Badge, Group, ActionIcon, Chip } from "@mantine/core";
import { IconEdit, IconTrash, IconTag } from "@tabler/icons-react";
import { DataTable } from "@/app/components/data-table";
import { Video, getStatusText, getStatusColor } from "../mock-data";
import classes from "../video-management.module.scss";

const columnHelper = createColumnHelper<Video>();

type VideoTableProps = {
  videos: Video[];
  onBottomReached: () => void;
  isLoading: boolean;
  showFilters: boolean;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
};

export function VideoTable({
  videos,
  onBottomReached,
  isLoading,
  showFilters,
  onEdit,
  onDelete,
}: VideoTableProps) {
  // 表格狀態管理
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // 定義表格欄位
  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "標題",
        cell: (info) => (
          <Text
            className={classes.videoTitle}
            data-testid={`video-title-${info.row.index}`}
          >
            {info.getValue()}
          </Text>
        ),
        enableSorting: true,
        meta: { enableFilter: true },
        size: 200,
      }),
      columnHelper.accessor("description", {
        header: "描述",
        cell: (info) => (
          <Text
            className={classes.videoDescription}
            data-testid={`video-description-${info.row.index}`}
          >
            {info.getValue()}
          </Text>
        ),
        meta: { enableFilter: true },
        size: 300,
      }),
      columnHelper.accessor("status", {
        header: "狀態",
        cell: (info) => {
          const status = info.getValue();
          const statusText = getStatusText(status);
          const statusColor = getStatusColor(status);

          return (
            <Badge
              color={statusColor}
              variant="light"
              data-testid={`video-status-${info.row.index}`}
              className={`${classes.statusBadge} ${
                classes[
                  `status${status.charAt(0).toUpperCase() + status.slice(1)}`
                ]
              }`}
            >
              {statusText}
            </Badge>
          );
        },
        enableSorting: true,
        meta: { enableFilter: true },
        size: 120,
      }),
      columnHelper.accessor("uploadDate", {
        header: "上傳日期",
        cell: (info) => (
          <Text
            className={classes.uploadDate}
            data-testid={`video-upload-date-${info.row.index}`}
          >
            {new Date(info.getValue()).toLocaleDateString("zh-TW")}
          </Text>
        ),
        enableSorting: true,
        meta: { enableFilter: true },
        size: 120,
      }),
      columnHelper.accessor("tags", {
        header: "標籤",
        cell: (info) => (
          <Group gap="xs" data-testid={`video-tags-${info.row.index}`}>
            {info
              .getValue()
              .slice(0, 2)
              .map((tag, index) => (
                <Chip
                  key={index}
                  size="xs"
                  variant="light"
                  icon={<IconTag size={12} />}
                >
                  {tag}
                </Chip>
              ))}
            {info.getValue().length > 2 && (
              <Text size="xs" c="dimmed">
                +{info.getValue().length - 2}
              </Text>
            )}
          </Group>
        ),
        meta: { enableFilter: true },
        size: 150,
      }),
      columnHelper.display({
        id: "actions",
        header: "操作",
        cell: (info) => (
          <Group gap="xs" className={classes.actionButtons}>
            <ActionIcon
              size="sm"
              variant="light"
              color="blue"
              onClick={() => onEdit(info.row.original)}
              data-testid={`edit-button-${info.row.index}`}
              className={`${classes.actionButton} ${classes.editButton}`}
            >
              <IconEdit size={14} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="light"
              color="red"
              onClick={() => onDelete(info.row.original)}
              data-testid={`delete-button-${info.row.index}`}
              className={`${classes.actionButton} ${classes.deleteButton}`}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        ),
        size: 100,
      }),
    ],
    [onEdit, onDelete]
  );

  // 建立表格實例
  const table = useReactTable({
    data: videos,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={classes.tableContainer}>
      <div className={classes.tableContent}>
        <DataTable
          table={table}
          onBottomReached={onBottomReached}
          isLoading={isLoading}
          emptyMessage="No data found"
          containerHeight={600}
          rowHeight={60}
          virtualized={true}
          showFilters={showFilters}
        />
      </div>
    </div>
  );
}
