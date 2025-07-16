import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// 設定 MSW worker
export const worker = setupWorker(...handlers);

// 開發環境設定
if (process.env.NODE_ENV === "development") {
  worker.start({
    onUnhandledRequest: "bypass", // 忽略未處理的請求
  });
}
