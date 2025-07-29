"use client";

import { useEffect } from "react";

export function MSWProvider() {
  useEffect(() => {
    console.log("Starting MSW in development mode...");
    import("../mocks").then(({ enableMocking }) => {
      enableMocking()
        .then(() => {
          console.log("MSW enabled successfully");
        })
        .catch((error) => {
          console.error("Failed to enable MSW:", error);
        });
    });
  }, []);

  return null;
}
