import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// 設定 MSW worker（只在瀏覽器環境中）
let worker: ReturnType<typeof setupWorker> | null = null;

if (typeof window !== "undefined") {
  // 只在瀏覽器環境中設定 worker
  worker = setupWorker(...handlers);

  // 開發環境設定
  if (process.env.NODE_ENV === "development") {
    worker.start({
      onUnhandledRequest: "bypass", // 忽略未處理的請求
    });
  }
}

export { worker };
