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
