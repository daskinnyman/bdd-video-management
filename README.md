# BDD Mantine App

這是一個使用 Next.js 和 Mantine UI 框架的應用程式。

## 技術棧

- **Next.js 15** - React 框架
- **Mantine 8** - React UI 組件庫
- **TypeScript** - 類型安全的 JavaScript
- **Tabler Icons** - 圖標庫

## 設定說明

### Mantine 設定

根據 [Mantine 官方指南](https://mantine.dev/guides/next/)，已完成以下設定：

1. **PostCSS 配置** (`postcss.config.js`)

   - 設定 `postcss-preset-mantine` 插件
   - 配置響應式斷點變數

2. **Layout 配置** (`src/app/layout.tsx`)

   - 導入 `MantineProvider` 和 `ColorSchemeScript`
   - 導入 Mantine CSS 樣式
   - 包裝應用程式根組件
   - 添加 `suppressHydrationWarning` 屬性以解決 hydration mismatch

3. **CSS 配置** (`src/app/globals.css`)

   - 導入 Mantine 核心樣式
   - 保留原有的自定義樣式

4. **依賴套件**
   - `@mantine/core` - 核心組件
   - `@mantine/hooks` - 實用 hooks
   - `@mantine/notifications` - 通知組件
   - `@tabler/icons-react` - 圖標庫
   - `postcss-preset-mantine` - PostCSS 插件
   - `postcss-simple-vars` - CSS 變數支援

### 重要修正

**Hydration Mismatch 錯誤修正：**

- 將 `ColorSchemeScript` 從 `<head>` 移到 `<body>` 內
- 在 `<html>` 和 `<body>` 標籤添加 `suppressHydrationWarning` 屬性
- 這解決了伺服器端和客戶端渲染不一致的問題

## 開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm start
```

## 功能特色

- ✅ 完整的 Mantine 8 設定
- ✅ TypeScript 支援
- ✅ 響應式設計
- ✅ 深色模式支援
- ✅ 現代化 UI 組件
- ✅ 圖標支援
- ✅ 無 hydration mismatch 錯誤

## 專案結構

```
src/
├── app/
│   ├── layout.tsx      # 根布局（包含 MantineProvider）
│   ├── page.tsx        # 主頁面（展示 Mantine 組件）
│   └── globals.css     # 全域樣式
├── components/         # 自定義組件（待添加）
└── ...
```

## 下一步

- 添加更多 Mantine 組件示例
- 實作深色模式切換
- 添加表單驗證
- 整合 API 調用
- 添加測試

## 參考資源

- [Mantine 官方文檔](https://mantine.dev/)
- [Next.js 文檔](https://nextjs.org/docs)
- [Tabler Icons](https://tabler-icons.io/)
