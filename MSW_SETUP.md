# MSW (Mock Service Worker) 整合說明

## 概述

本專案已整合 MSW 來模擬 API 請求，讓您可以在開發和測試環境中使用一致的 mock 資料。

## 檔案結構

```
src/mocks/
├── handlers.ts      # API handlers 定義
├── browser.ts       # 瀏覽器環境設定
├── server.ts        # Node.js 環境設定（測試用）
└── index.ts         # 統一入口檔案
```

## 已設定的 API Handlers

### 登入 API (`POST /api/login`)

支援以下測試帳號：

- **一般使用者**: `test@example.com` / `password123`
- **管理員**: `admin@example.com` / `admin123`
- **無效帳號**: `invalid@example.com` / `wrongpassword`

### 使用者資訊 API (`GET /api/user/profile`)

回傳一般使用者資訊。

### 管理員資訊 API (`GET /api/admin/profile`)

回傳管理員資訊。

## 開發環境使用

MSW 會在開發環境中自動啟動，攔截所有定義的 API 請求。

### 啟動開發伺服器

```bash
npm run dev
```

### 查看 MSW 狀態

在瀏覽器開發者工具中，您會看到 MSW 的相關訊息。

## 測試環境使用

MSW 已在 Jest 設定中整合，會在測試執行時自動啟動。

### 執行測試

```bash
npm test
```

## 新增新的 API Handler

1. 在 `src/mocks/handlers.ts` 中新增 handler：

```typescript
import { http, HttpResponse } from "msw";

export const handlers = [
  // 現有的 handlers...

  // 新增的 handler
  http.get("/api/new-endpoint", () => {
    return HttpResponse.json({
      data: "mock response",
    });
  }),
];
```

2. 重新啟動開發伺服器或測試。

## 自訂 Handler 回應

您可以在測試中動態修改 handler 回應：

```typescript
import { server } from "../src/mocks/server";
import { http, HttpResponse } from "msw";

// 在測試中覆寫 handler
server.use(
  http.post("/api/login", () => {
    return HttpResponse.json(
      {
        success: false,
        message: "Custom error message",
      },
      { status: 401 }
    );
  })
);
```

## 注意事項

- MSW 只在開發和測試環境中啟用
- 生產環境不會包含 MSW 相關程式碼
- 所有 API 請求都會被攔截，確保測試的一致性
- 如需連接到真實 API，請在生產環境中移除 MSW 設定

## 故障排除

### MSW 未啟動

1. 確認 `NODE_ENV` 設定為 `development`
2. 檢查瀏覽器控制台是否有錯誤訊息
3. 確認 `public/mockServiceWorker.js` 檔案存在

### 測試失敗

1. 確認 Jest 設定正確
2. 檢查 `jest.setup.ts` 檔案
3. 確認 MSW server 在測試中正確啟動

## 相關文件

- [MSW 官方文件](https://mswjs.io/)
- [MSW 與 Next.js 整合](https://mswjs.io/docs/getting-started/integrate/browser)
- [MSW 與 Jest 整合](https://mswjs.io/docs/getting-started/integrate/node)
