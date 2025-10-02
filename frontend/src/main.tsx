import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { api } from "./lib/api";

// Removed PWA service worker registration

// Verify backend connectivity on startup (non-blocking, no UI changes)
api
  .health()
  .then((h) => console.log("Backend health:", h))
  .catch((e) => console.error("Backend health check failed:", e?.message || e));

const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string | undefined;

createRoot(document.getElementById("root")!).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  ) : (
    <App />
  )
);
