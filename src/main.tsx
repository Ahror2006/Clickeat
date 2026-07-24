import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "leaflet/dist/leaflet.css";
import "./index.css";

import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-[#f6f1ea]" />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
