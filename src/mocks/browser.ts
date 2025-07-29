import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// 設定 MSW worker
export const worker = setupWorker(...handlers);
