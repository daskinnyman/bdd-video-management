export type VideoStatus = "pending" | "published" | "rejected";

export type Video = {
  id: string;
  title: string;
  description: string;
  status: VideoStatus;
  uploadDate: string;
  tags: string[];
  thumbnailUrl?: string;
  duration?: string;
  views?: number;
};

// 生成隨機日期
const generateRandomDate = (start: Date, end: Date): string => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
};

// 生成隨機標籤
const generateRandomTags = (): string[] => {
  const allTags = [
    "教育",
    "娛樂",
    "科技",
    "音樂",
    "遊戲",
    "旅遊",
    "美食",
    "運動",
    "時尚",
    "健康",
  ];
  const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 個標籤
  const shuffled = allTags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
};

// 生成 50 個影片的 mock 資料
export const generateMockVideos = (count: number = 50): Video[] => {
  const videos: Video[] = [];
  const titles = [
    "React 基礎教學",
    "TypeScript 進階技巧",
    "Next.js 13 新功能介紹",
    "Mantine UI 組件庫使用指南",
    "前端測試最佳實踐",
    "CSS Grid 完整教程",
    "JavaScript 非同步程式設計",
    "Vue.js 3 組合式 API",
    "Node.js 後端開發",
    "資料庫設計原則",
    "API 設計與實作",
    "微服務架構介紹",
    "Docker 容器化部署",
    "CI/CD 流程建立",
    "效能優化技巧",
    "安全性最佳實踐",
    "SEO 優化指南",
    "響應式設計原則",
    "無障礙網頁設計",
    "PWA 開發實戰",
  ];

  const descriptions = [
    "深入淺出地介紹 React 的核心概念和實作技巧",
    "學習 TypeScript 的高級功能和最佳實踐",
    "探索 Next.js 13 的新特性和改進",
    "完整學習 Mantine UI 組件庫的使用方法",
    "掌握前端測試的各種技巧和工具",
    "從基礎到進階的 CSS Grid 完整教學",
    "理解 JavaScript 非同步程式設計模式",
    "Vue.js 3 組合式 API 的詳細教學",
    "使用 Node.js 建立高效能的後端服務",
    "學習資料庫設計的核心原則和技巧",
    "設計和實作 RESTful API 的最佳實踐",
    "微服務架構的設計原則和實作方法",
    "使用 Docker 進行容器化部署",
    "建立完整的 CI/CD 流程",
    "前端和後端的效能優化技巧",
    "網頁應用程式的安全性最佳實踐",
    "搜尋引擎優化的完整指南",
    "響應式網頁設計的核心原則",
    "建立無障礙的網頁應用程式",
    "Progressive Web App 的開發實戰",
  ];

  for (let i = 0; i < count; i++) {
    const titleIndex = i % titles.length;
    const descriptionIndex = i % descriptions.length;

    videos.push({
      id: `video-${i + 1}`,
      title: `${titles[titleIndex]} ${i + 1}`,
      description: descriptions[descriptionIndex],
      status: ["pending", "published", "rejected"][
        Math.floor(Math.random() * 3)
      ] as VideoStatus,
      uploadDate: generateRandomDate(new Date("2024-01-01"), new Date()),
      tags: generateRandomTags(),
      thumbnailUrl: `https://picsum.photos/300/200?random=${i}`,
      duration: `${Math.floor(Math.random() * 60) + 10}:${Math.floor(
        Math.random() * 60
      )
        .toString()
        .padStart(2, "0")}`,
      views: Math.floor(Math.random() * 10000) + 100,
    });
  }

  return videos;
};

// 預設的 50 個影片資料
export const mockVideos = generateMockVideos(50);

// 狀態顯示文字
export const getStatusText = (status: VideoStatus): string => {
  switch (status) {
    case "pending":
      return "審核中";
    case "published":
      return "已發布";
    case "rejected":
      return "被拒絕";
    default:
      return "未知";
  }
};

// 狀態顏色
export const getStatusColor = (status: VideoStatus): string => {
  switch (status) {
    case "pending":
      return "yellow";
    case "published":
      return "green";
    case "rejected":
      return "red";
    default:
      return "gray";
  }
};
