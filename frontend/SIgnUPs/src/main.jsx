import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// Import ChatProvider from your context file
import { ChatProvider } from "./Context/ChatProvider"; // Adjust path as necessary

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    {/* Wrap App with ChatProvider */}
    <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>
);
