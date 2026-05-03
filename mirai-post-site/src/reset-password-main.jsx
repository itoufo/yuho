import React from "react";
import { createRoot } from "react-dom/client";
import ResetPassword from "./ResetPassword.jsx";
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ResetPassword />
  </React.StrictMode>,
);
