async function enableMocking() {
  if (typeof window === "undefined") {
    // 在 Node.js 環境中（如測試），使用 server
    const { server } = await import("./server");
    server.listen();
  } else {
    // 在瀏覽器環境中，使用 worker
    const { worker } = await import("./browser");
    try {
      await worker.start({
        onUnhandledRequest: "bypass", // 忽略未處理的請求
      });
      console.log("MSW worker started successfully");
    } catch (error) {
      console.error("Failed to start MSW worker:", error);
    }
  }
}

export { enableMocking };
