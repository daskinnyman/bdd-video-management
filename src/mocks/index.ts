async function enableMocking() {
  if (typeof window === "undefined") {
    // 在 Node.js 環境中（如測試），使用 server
    const { server } = await import("./server");
    server.listen();
  } else {
    // 在瀏覽器環境中，使用 worker
    const { worker } = await import("./browser");
    return worker.start();
  }
}

export { enableMocking };
