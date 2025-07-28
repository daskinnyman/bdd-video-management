"use client";

import React, { useState } from "react";
import { DataTable } from "../components/data-table";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Button,
  Group,
  Paper,
  Title,
  Badge,
  Tooltip,
  Text,
  Flex,
} from "@mantine/core";

type DemoData = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  department: string;
  budget: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

const columns: ColumnDef<DemoData>[] = [
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
    header: "標題",
    enableSorting: true,
    meta: {
      enableFilter: true,
    },
  },
  {
    accessorKey: "description",
    header: "描述",
    meta: {
      enableFilter: true,
    },
    cell: ({ getValue }) => {
      const description = getValue() as string;
      return (
        <Tooltip label={description} position="top" withArrow>
          <Text size="sm" truncate data-testid="truncated-text-description">
            {description}
          </Text>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "status",
    header: "狀態",
    enableSorting: true,
    meta: {
      enableFilter: true,
    },
    cell: ({ getValue }) => {
      const status = getValue() as string;
      if (!status) return "-";
      const color =
        status === "進行中"
          ? "blue"
          : status === "已完成"
          ? "green"
          : status === "待處理"
          ? "yellow"
          : "gray";
      return <Badge color={color}>{status}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: "優先級",
    enableSorting: true,
    meta: {
      enableFilter: true,
    },
    cell: ({ getValue }) => {
      const priority = getValue() as string;
      if (!priority) return "-";
      const color =
        priority === "高" ? "red" : priority === "中" ? "orange" : "green";
      return (
        <Badge color={color} variant="light">
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: "負責人",
    enableSorting: true,
    meta: {
      enableFilter: true,
    },
  },
  {
    accessorKey: "department",
    header: "部門",
    enableSorting: true,
    meta: {
      enableFilter: true,
    },
  },
  {
    accessorKey: "budget",
    header: "預算",
    enableSorting: true,
    cell: ({ getValue }) => {
      const budget = getValue() as number;
      if (budget === null || budget === undefined) return "-";
      return `$${budget.toLocaleString()}`;
    },
  },
  {
    accessorKey: "progress",
    header: "進度",
    enableSorting: true,
    cell: ({ getValue }) => {
      const progress = getValue() as number;
      if (progress === null || progress === undefined) return "-";
      return `${progress}%`;
    },
  },
  {
    accessorKey: "createdAt",
    header: "建立時間",
    enableSorting: true,
  },
  {
    accessorKey: "updatedAt",
    header: "更新時間",
    enableSorting: true,
  },
  {
    accessorKey: "tags",
    header: "標籤",
    cell: ({ getValue }) => {
      const tags = getValue() as string[];
      if (!tags || !Array.isArray(tags) || tags.length === 0) return "-";
      return (
        <Group gap="xs">
          {tags.map((tag, index) => (
            <Badge key={index} size="sm" variant="outline">
              {tag}
            </Badge>
          ))}
        </Group>
      );
    },
  },
];

const generateDemoData = (count: number, startAt: number = 0): DemoData[] => {
  const statuses = ["進行中", "已完成", "待處理", "已暫停"];
  const priorities = ["高", "中", "低"];
  const assignees = ["張三", "李四", "王五", "趙六", "錢七"];
  const departments = ["研發部", "行銷部", "財務部", "人資部", "客服部"];
  const tags = [
    "前端",
    "後端",
    "UI/UX",
    "測試",
    "部署",
    "維護",
    "新功能",
    "修復",
  ];

  // 使用固定的種子來確保 SSR 和客戶端生成相同的數據
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return Array.from({ length: count }, (_, index) => {
    const baseSeed = index + startAt;
    const budgetSeed = baseSeed * 7;
    const progressSeed = baseSeed * 11;
    const dateSeed = baseSeed * 13;

    return {
      id: index + startAt + 1,
      title: `專案 ${index + 1} - ${
        ["網站開發", "APP開發", "系統整合", "資料分析", "AI模型"][index % 5]
      }`,
      description: `這是專案 ${
        index + startAt
      } 的詳細描述，包含專案的目標、範圍和預期成果。這是一個重要的專案，需要團隊協作完成。`,
      status: statuses[index % statuses.length] || "待處理",
      priority: priorities[index % priorities.length] || "中",
      assignee: assignees[index % assignees.length] || "張三",
      department: departments[index % departments.length] || "研發部",
      budget: Math.floor(seededRandom(budgetSeed) * 100000) + 10000,
      progress: Math.floor(seededRandom(progressSeed) * 100),
      createdAt: new Date(Date.now() - seededRandom(dateSeed) * 10000000000)
        .toISOString()
        .split("T")[0], // 使用 ISO 格式確保一致性
      updatedAt: new Date(Date.now() - seededRandom(dateSeed + 1) * 5000000000)
        .toISOString()
        .split("T")[0], // 使用 ISO 格式確保一致性
      tags: tags
        .slice(0, Math.floor(seededRandom(baseSeed * 17) * 4) + 1)
        .sort(() => seededRandom(baseSeed * 19) - 0.5) || ["一般"],
    };
  });
};

export default function TableDemoPage() {
  const [data, setData] = useState<DemoData[]>(generateDemoData(50));
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleLoadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      const newData = generateDemoData(10, data.length);
      setData((prev) => [...prev, ...newData]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <Paper shadow="xs" p="md" mb="lg">
        <Title order={2} mb="md">
          資料表格展示 - 多欄位版本
        </Title>
        <p style={{ color: "#666", fontSize: "14px" }}>
          此表格包含 12
          個欄位，支援水平滾動。您可以點擊欄位標頭進行排序，滾動到底部載入更多資料。
        </p>
      </Paper>

      <Paper shadow="xs" p="md">
        <Flex justify="flex-end" align="center" py="md">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            color="gray"
            variant="outline"
            data-testid="toggle-all-filters"
          >
            {showFilters ? "隱藏篩選" : "顯示篩選"}
          </Button>
        </Flex>
        <DataTable
          table={table}
          onBottomReached={handleLoadMore}
          isLoading={isLoading}
          emptyMessage="目前沒有資料"
          containerHeight={600}
          showFilters={showFilters}
        />
      </Paper>
    </div>
  );
}
