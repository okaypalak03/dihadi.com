import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import "./index.css";
import "./App.css";

// Prevent browser alerts - block them completely
// All alerts should use the toast system instead
if (typeof window !== 'undefined') {
  window.alert = () => {
    console.warn('Browser alert() is disabled. Use toast.success() or toast.error() instead.');
  };
  window.confirm = () => {
    console.warn('Browser confirm() is disabled. Use ConfirmModal component instead.');
    return false;
  };
  window.prompt = () => {
    console.warn('Browser prompt() is disabled. Use a custom modal component instead.');
    return null;
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
