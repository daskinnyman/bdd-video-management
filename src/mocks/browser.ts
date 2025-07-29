import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// 設定 MSW worker
export const worker = setupWorker(...handlers);

// 立即啟動 worker
worker
  .start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  })
  .then(() => {
    console.log("MSW worker started successfully");
  })
  .catch((error) => {
    console.error("Failed to start MSW worker:", error);
  });
