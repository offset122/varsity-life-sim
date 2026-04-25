import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (rootElement) {
  // Ensure the container is ready and has dimensions before rendering
  // This helps prevent WebGL context creation errors in some environments
  const renderApp = () => {
    createRoot(rootElement).render(<App />);
  };

  if (document.readyState === 'complete') {
    renderApp();
  } else {
    window.addEventListener('load', renderApp, { once: true });
  }
}