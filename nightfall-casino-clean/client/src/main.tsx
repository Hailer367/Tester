import { createRoot } from "react-dom/client";
import "./lib/browser-polyfills";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
