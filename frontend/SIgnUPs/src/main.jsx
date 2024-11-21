import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SignApp from "./SignApp";
// import Signup from "./signup";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <SignApp />
  </StrictMode>
);
