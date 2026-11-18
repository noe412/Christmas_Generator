import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/great-vibes/400.css";
import "@fontsource/merriweather/400.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
