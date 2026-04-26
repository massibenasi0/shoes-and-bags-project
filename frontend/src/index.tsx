import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./store";
import { router } from "./router";
import { ThemeProvider } from "./theme/ThemeProvider";
import { fetchCurrentUser } from "./store/authSlice";
import "./i18n";
import "./index.css";

// Restore session on app load
if (localStorage.getItem("access_token")) {
  store.dispatch(fetchCurrentUser());
}

// Apply saved theme immediately (before first paint)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
