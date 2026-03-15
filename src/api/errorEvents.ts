// Browser event bridge for app-wide API error feedback.
import type { ApiError } from "./types";

export interface GlobalApiErrorDetail extends ApiError {
  shouldLogout?: boolean;
}

const GLOBAL_API_ERROR_EVENT = "glework:api-error";

export const emitGlobalApiError = (detail: GlobalApiErrorDetail): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<GlobalApiErrorDetail>(GLOBAL_API_ERROR_EVENT, {
      detail,
    })
  );
};

export const addGlobalApiErrorListener = (
  listener: (detail: GlobalApiErrorDetail) => void
): (() => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<GlobalApiErrorDetail>;
    listener(customEvent.detail);
  };

  window.addEventListener(GLOBAL_API_ERROR_EVENT, handler);

  return () => {
    window.removeEventListener(GLOBAL_API_ERROR_EVENT, handler);
  };
};
