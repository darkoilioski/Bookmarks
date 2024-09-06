import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClientProviderWrapper } from "./api/queryClient.tsx";
import './backgroundCSS.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProviderWrapper>
      <App />
    </QueryClientProviderWrapper>
  </React.StrictMode>
);
