"use client";

import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("Starting MSW in development mode...");

    // 直接啟動 MSW worker
    import("../mocks/browser").then(({ worker }) => {
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
    });
  }, []);

  return <>{children}</>;
}
