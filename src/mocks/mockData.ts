// 影片狀態類型
export type VideoStatus = "published" | "pending" | "rejected";

// 影片介面
export interface Video {
  id: string;
  title: string;
  description: string;
  status: VideoStatus;
  uploadDate: string;
  tags: string[];
  thumbnailUrl: string;
  duration: string;
  views: number;
}

// 影片標題模板
const videoTitles = [
  "React 基礎教學",
  "TypeScript 進階技巧",
  "Next.js 新功能介紹",
  "Vue.js 實戰開發",
  "Node.js 後端開發",
  "Python 資料分析",
  "JavaScript ES6+ 新特性",
  "CSS Grid 佈局技巧",
  "Git 版本控制",
  "Docker 容器化部署",
  "AWS 雲端服務",
  "MongoDB 資料庫設計",
  "GraphQL API 開發",
  "微服務架構",
  "DevOps 最佳實踐",
  "前端效能優化",
  "React Native 跨平台開發",
  "Flutter 應用開發",
  "機器學習入門",
  "區塊鏈技術基礎",
  "Angular 框架教學",
  "Svelte 現代前端框架",
  "Deno 執行環境",
  "Rust 系統程式設計",
  "Go 語言後端開發",
  "Kubernetes 容器編排",
  "微前端架構設計",
  "PWA 漸進式網頁應用",
  "WebAssembly 技術",
  "Serverless 架構",
  "資料庫優化技巧",
];

// 影片描述模板
const videoDescriptions = [
  "深入淺出地介紹核心概念和實作技巧",
  "學習高級功能和最佳實踐",
  "探索新特性和改進",
  "實戰開發經驗分享",
  "從零開始的完整教學",
  "進階技巧和實用範例",
  "實作專案和案例分析",
  "效能優化和最佳實踐",
  "常見問題和解決方案",
  "業界標準和最新趨勢",
  "實用工具和框架介紹",
  "程式設計思維培養",
  "軟體架構設計原則",
  "測試驅動開發方法",
  "持續整合與部署",
  "程式碼品質管理",
  "團隊協作最佳實踐",
  "技術選型考量因素",
  "效能監控與調優",
  "安全性考量與實作",
];

// 標籤選項
const availableTags = [
  "教育",
  "科技",
  "程式設計",
  "前端",
  "後端",
  "資料庫",
  "雲端",
  "DevOps",
  "AI",
  "機器學習",
  "區塊鏈",
  "移動開發",
  "網頁設計",
  "效能優化",
  "測試",
  "部署",
  "架構",
  "安全",
  "框架",
  "工具",
  "最佳實踐",
  "實戰",
  "入門",
  "進階",
  "API",
  "微服務",
  "容器化",
  "自動化",
  "監控",
  "除錯",
];

// 狀態選項
const statusOptions: VideoStatus[] = ["published", "pending", "rejected"];

// 生成隨機標籤
function generateRandomTags(): string[] {
  const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 個標籤
  const shuffled = [...availableTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
}

// 生成隨機時長
function generateRandomDuration(): string {
  const minutes = Math.floor(Math.random() * 45) + 5; // 5-50 分鐘
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// 生成隨機觀看次數
function generateRandomViews(): number {
  return Math.floor(Math.random() * 10000) + 100; // 100-10100 次觀看
}

// 生成隨機日期
function generateRandomDate(): string {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate.toISOString().split("T")[0];
}

// 生成單個影片資料
function generateVideo(index: number): Video {
  const titleIndex = index % videoTitles.length;
  const descIndex = index % videoDescriptions.length;
  const statusIndex = index % statusOptions.length;

  return {
    id: `video-${index + 1}`,
    title: `${videoTitles[titleIndex]} ${index + 1}`,
    description: `${videoDescriptions[descIndex]} - 第 ${index + 1} 集`,
    status: statusOptions[statusIndex],
    uploadDate: generateRandomDate(),
    tags: generateRandomTags(),
    thumbnailUrl: `https://picsum.photos/300/200?random=${index + 1}`,
    duration: generateRandomDuration(),
    views: generateRandomViews(),
  };
}

// 生成指定數量的影片資料
export function generateMockVideos(count: number = 100): Video[] {
  const videos: Video[] = [];

  for (let i = 0; i < count; i++) {
    videos.push(generateVideo(i));
  }

  return videos;
}

// 預設生成 100 個影片
export const mockVideos = generateMockVideos(100);
