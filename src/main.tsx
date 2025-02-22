import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import { SyntaxHighlighterProvider } from "./SyntaxHighlighterProvider";

import { RouterProvider } from "react-router-dom";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <SyntaxHighlighterProvider>
        <RouterProvider router={router} />
      </SyntaxHighlighterProvider>
  </React.StrictMode>,
);
