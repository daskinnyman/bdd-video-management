import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// 設定 MSW server（用於 Node.js 環境，如測試）
export const server = setupServer(...handlers);
