// Prefer runtime config so the same build can point to different APIs.
export const API_BASE_URL =
  (typeof window !== "undefined" && window.__APP_CONFIG__?.API_URL) ||
  import.meta.env.VITE_API_URL;
