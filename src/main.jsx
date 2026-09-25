import React from "react";
import ReactDOM from "react-dom/client";
import { Monitor } from "lucide-react";
import App from "./App.jsx";
import "./index.css";

function MobileWarning() {
  return (
    <div className="mobile-warning">
      <div className="mobile-warning-card">
        <div className="mobile-warning-icon">
          <Monitor size={42} strokeWidth={1.8} />
        </div>

        <h1>Website Tidak Tersedia di Mobile</h1>

        <p>
          Mohon maaf, website ini saat ini hanya tersedia untuk tampilan
          desktop.
        </p>
      </div>
    </div>
  );
}

function Root() {
  const isMobile = window.innerWidth <= 768;

  return isMobile ? <MobileWarning /> : <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
