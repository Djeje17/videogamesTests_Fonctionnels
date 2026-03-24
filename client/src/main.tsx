import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // On importe le composant App qui contient ton routeur complet

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
