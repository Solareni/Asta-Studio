import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./ThemeContext";
import { SyntaxHighlighterProvider } from "./SyntaxHighlighterProvider";

import { RouterProvider } from "react-router-dom";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <SyntaxHighlighterProvider>
        <RouterProvider router={router} />
      </SyntaxHighlighterProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
