import { createRoot } from "react-dom/client";
import "./lib/browser-polyfills";
import App from "./App";
import "./index.css";

// Add global error handling
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

createRoot(document.getElementById("root")!).render(<App />);
