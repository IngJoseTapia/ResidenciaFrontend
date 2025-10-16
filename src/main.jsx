//src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { UserProvider } from "./context/UserProvider";
import { NotificationProvider } from "./context/NotificationProvider";
import { VocaliaProvider } from "./context/VocaliaProvider"; // 👈 IMPORTAR
import { Toaster } from "react-hot-toast"; // 👈 Importar

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <NotificationProvider>
          <VocaliaProvider>
            <App />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 5000,
                style: { borderRadius: "10px", background: "#333", color: "#fff" },
              }}
            />
          </VocaliaProvider>
        </NotificationProvider>
      </UserProvider>
    </AuthProvider>
  //</React.StrictMode>
);
