import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AppProviders from "./AppProviders.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ All contexts (Auth, Cart, Wishlist) are provided globally */}
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
