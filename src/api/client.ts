// Shared Axios client with auth headers and app-level error handling.
import axios, { AxiosHeaders } from "axios";
import { API_BASE_URL } from "../config";
import { emitGlobalApiError } from "./errorEvents";
import { toApiError } from "./errors";
import { getToken } from "./session";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers ?? {});
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    const status = apiError.status;
    const headers = AxiosHeaders.from(error.config?.headers ?? {});
    const hasAuthHeader = Boolean(headers.get("Authorization"));

    // Only globalize errors that affect the whole app state or session.
    if (status === 401 && hasAuthHeader) {
      emitGlobalApiError({
        ...apiError,
        shouldLogout: true,
      });
    } else if (status && status >= 500) {
      emitGlobalApiError(apiError);
    }

    return Promise.reject(error);
  }
);
