// Centralized browser session helpers used by the auth flow.
import type { AuthUser } from "./types";

const STORAGE_KEYS = {
  user: "user",
  userId: "userId",
  token: "token",
  role: "role",
} as const;

// Invalid stored JSON should not break the app on load.
const parseStoredUser = (value: string | null): AuthUser | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => localStorage.getItem(STORAGE_KEYS.token);

export const getUserId = (): string | null => localStorage.getItem(STORAGE_KEYS.userId);

export const getRole = (): string | null => localStorage.getItem(STORAGE_KEYS.role);

export const getStoredUser = (): AuthUser | null =>
  parseStoredUser(localStorage.getItem(STORAGE_KEYS.user));

// Keep legacy keys in sync until the auth storage strategy changes.
export const setSession = (user: AuthUser): void => {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.userId, user.id);
  localStorage.setItem(STORAGE_KEYS.token, user.token);
  localStorage.setItem(STORAGE_KEYS.role, user.role);
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.userId);
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.role);
};

export const isAuthenticated = (): boolean => Boolean(getToken());
