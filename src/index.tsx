import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import ErrorBoundary from "./components/ErroeBoundary";
import store from "./components/Store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js")
          .then((reg) => console.log("Service Worker Registered", reg))
          .catch((err) => console.log("Service Worker Registration Failed", err));
  });
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App/>
        
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);