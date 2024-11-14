import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/sonner.jsx";
import { SocketContextProvider } from "@/context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketContextProvider>
        <App />
        <Toaster closeButton />
      </SocketContextProvider>
    </Provider>
  </React.StrictMode>
);
