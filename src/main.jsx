import React from "react";
import { createRoot } from "react-dom/client";
import AuroreApp from "./AuroreApp.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuroreApp />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register the service worker in production only (avoids caching during `vite dev`).
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}
