// Authentication API calls and normalized auth responses.
import { api } from "./client";
import { toApiError } from "./errors";
import { mapAuthCheckResult, mapAuthUser } from "./mappers";
import type {
  AuthCheckResult,
  AuthUser,
  ForgotPasswordResponse,
  RegisterPayload,
} from "./types";

export const login = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return mapAuthUser(response.data);
  } catch (error) {
    throw toApiError(error);
  }
};

export const register = async (payload: RegisterPayload): Promise<unknown> => {
  try {
    const response = await api.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const forgotPassword = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data as ForgotPasswordResponse;
  } catch (error) {
    throw toApiError(error);
  }
};

export const resetPassword = async (
  userId: string,
  newPassword: string
): Promise<unknown> => {
  try {
    const response = await api.post(`/auth/reset-password/${userId}`, {
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const authCheck = async (): Promise<AuthCheckResult> => {
  try {
    const response = await api.get("/auth/auth-check");
    return mapAuthCheckResult(response.data);
  } catch (error) {
    throw toApiError(error);
  }
};
