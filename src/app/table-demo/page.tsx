"use client";

import React, { useState } from "react";
import { DataTable } from "../components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Group, Paper, Title, Badge } from "@mantine/core";
import { notifications } from "@mantine/notifications";

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
  },
  {
    accessorKey: "title",
    header: "標題",
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "描述",
  },
  {
    accessorKey: "status",
    header: "狀態",
    enableSorting: true,

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
  },
  {
    accessorKey: "department",
    header: "部門",
    enableSorting: true,
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

const generateDemoData = (count: number): DemoData[] => {
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

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `專案 ${index + 1} - ${
      ["網站開發", "APP開發", "系統整合", "資料分析", "AI模型"][index % 5]
    }`,
    description: `這是專案 ${
      index + 1
    } 的詳細描述，包含專案的目標、範圍和預期成果。這是一個重要的專案，需要團隊協作完成。`,
    status: statuses[index % statuses.length] || "待處理",
    priority: priorities[index % priorities.length] || "中",
    assignee: assignees[index % assignees.length] || "張三",
    department: departments[index % departments.length] || "研發部",
    budget: Math.floor(Math.random() * 100000) + 10000,
    progress: Math.floor(Math.random() * 100),
    createdAt: new Date(
      Date.now() - Math.random() * 10000000000
    ).toLocaleDateString(),
    updatedAt: new Date(
      Date.now() - Math.random() * 5000000000
    ).toLocaleDateString(),
    tags: tags
      .slice(0, Math.floor(Math.random() * 4) + 1)
      .sort(() => Math.random() - 0.5) || ["一般"],
  }));
};

export default function TableDemoPage() {
  const [data, setData] = useState<DemoData[]>(generateDemoData(50));
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newData = generateDemoData(10);
      setData((prev) => [...prev, ...newData]);
      setIsLoading(false);
      notifications.show({
        title: "載入完成",
        message: "已載入 10 筆新資料",
        color: "green",
      });
    }, 1000);
  };

  const handleAddData = () => {
    const newItem: DemoData = {
      id: data.length + 1,
      title: `新專案 ${data.length + 1}`,
      description: "這是一個新專案的描述",
      status: "待處理",
      priority: "中",
      assignee: "張三",
      department: "研發部",
      budget: 50000,
      progress: 0,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
      tags: ["新功能"],
    };
    setData((prev) => [newItem, ...prev]);
    notifications.show({
      title: "新增成功",
      message: "已新增一筆資料",
      color: "blue",
    });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <Paper shadow="xs" p="md" mb="lg">
        <Title order={2} mb="md">
          資料表格展示 - 多欄位版本
        </Title>
        <Group mb="md">
          <Button onClick={handleAddData} color="blue">
            新增資料
          </Button>
          <Button onClick={() => setData([])} color="red" variant="outline">
            清空資料
          </Button>
        </Group>
        <p style={{ color: "#666", fontSize: "14px" }}>
          此表格包含 12
          個欄位，支援水平滾動。您可以點擊欄位標頭進行排序，滾動到底部載入更多資料。
        </p>
      </Paper>

      <Paper shadow="xs" p="md">
        <DataTable
          data={data}
          columns={columns}
          onBottomReached={handleLoadMore}
          isLoading={isLoading}
          emptyMessage="目前沒有資料"
          containerHeight={600}
        />
      </Paper>
    </div>
  );
}
