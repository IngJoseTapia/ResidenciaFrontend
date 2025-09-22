import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { UserProvider } from "./context/UserProvider"; // <-- importar UserProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider> {/* <-- envolver App con UserProvider */}
        <App />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);
