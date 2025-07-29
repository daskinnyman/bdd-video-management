async function enableMocking() {
  if (typeof window === "undefined") {
    // 在 Node.js 環境中（如測試），使用 server
    const { server } = await import("./server");
    server.listen();
  }
  // 在瀏覽器環境中，worker 已經在 browser.ts 中自動啟動
}

export { enableMocking };
