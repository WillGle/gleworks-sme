// User profile and admin user list API calls.
import { api } from "./client";
import { toApiError } from "./errors";
import { mapUserListItem, mapUserProfile } from "./mappers";
import type {
  UpdateUserPayload,
  UserListItem,
  UserProfile,
} from "./types";

export const listUsers = async (): Promise<UserListItem[]> => {
  try {
    const response = await api.get("/users");
    return Array.isArray(response.data)
      ? response.data.map(mapUserListItem)
      : [];
  } catch (error) {
    throw toApiError(error);
  }
};

export const getUser = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return mapUserProfile(response.data);
  } catch (error) {
    throw toApiError(error);
  }
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<UserProfile> => {
  try {
    const response = await api.put(`/users/${userId}`, payload);
    return mapUserProfile(response.data);
  } catch (error) {
    throw toApiError(error);
  }
};
