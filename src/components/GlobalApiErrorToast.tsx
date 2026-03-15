// Listens for shared API error events and shows one app-level toast.
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { clearSession } from "@api";
import { addGlobalApiErrorListener } from "@api/errorEvents";
import type { GlobalApiErrorDetail } from "@api/errorEvents";
import "./GlobalApiErrorToast.css";

interface ToastState {
  message: string;
  status?: number;
}

const LOGIN_ROUTES = ["/login", "/signup", "/lost-password"];

// Keep the message mapping in one place so 401/500 feel consistent.
const getToastMessage = ({ message, status }: GlobalApiErrorDetail): string => {
  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status && status >= 500) {
    return message || "Server error. Please try again.";
  }

  return message || "Something went wrong. Please try again.";
};

const GlobalApiErrorToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const clearToastTimer = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };

    const removeListener = addGlobalApiErrorListener((detail) => {
      clearToastTimer();

      setToast({
        message: getToastMessage(detail),
        status: detail.status,
      });

      // A forced logout should clear the current session before redirecting.
      if (detail.shouldLogout) {
        clearSession();

        if (!LOGIN_ROUTES.includes(location.pathname)) {
          navigate("/login", { replace: true });
        }
      }

      timeoutRef.current = window.setTimeout(() => {
        setToast(null);
      }, 4000);
    });

    return () => {
      clearToastTimer();
      removeListener();
    };
  }, [location.pathname, navigate]);

  if (!toast) {
    return null;
  }

  return (
    <div className="global-api-error-toast" role="alert" aria-live="assertive">
      <div className="global-api-error-toast__content">
        <strong className="global-api-error-toast__title">
          {toast.status === 401 ? "Session expired" : "Request failed"}
        </strong>
        <p className="global-api-error-toast__message">{toast.message}</p>
      </div>
      <button
        className="global-api-error-toast__close"
        type="button"
        onClick={() => setToast(null)}
        aria-label="Dismiss message"
      >
        ×
      </button>
    </div>
  );
};

export default GlobalApiErrorToast;
