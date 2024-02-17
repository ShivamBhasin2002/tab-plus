import { createRoot } from "react-dom/client";
import { NewTab } from "./newTab";

function init() {
  const appContainer = document.createElement("body");
  appContainer.style.margin = "0";
  document.body.replaceWith(appContainer);
  if (!appContainer) {
    throw new Error("Can not find AppContainer");
  }
  const root = createRoot(appContainer);
  root.render(<NewTab />);
}

init();
