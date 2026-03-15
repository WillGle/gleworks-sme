// Converts raw request failures into a small app-level error shape.
import axios from "axios";

import type { ApiError } from "./types";

interface ErrorPayload {
  message?: string;
  error?: string;
  code?: string;
}

const isErrorPayload = (value: unknown): value is ErrorPayload =>
  typeof value === "object" && value !== null;

export const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const message =
      typeof responseData === "string"
        ? responseData
        : isErrorPayload(responseData)
          ? responseData.message || responseData.error || "Request failed"
          : error.message || "Request failed";

    return {
      message,
      status: error.response?.status,
      code: isErrorPayload(responseData) ? responseData.code : undefined,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Request failed",
  };
};
