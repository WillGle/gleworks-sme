// Service API calls used by the public booking flow.
import { api } from "./client";
import { toApiError } from "./errors";
import { mapServiceOptionsResponse, mapServiceSummary } from "./mappers";
import type {
  ServiceOptionsResponse,
  ServiceSummary,
} from "./types";

export const listServices = async (): Promise<ServiceSummary[]> => {
  try {
    const response = await api.get("/services");
    return Array.isArray(response.data)
      ? response.data.map(mapServiceSummary)
      : [];
  } catch (error) {
    throw toApiError(error);
  }
};

export const getServiceOptions = async (
  serviceId: number
): Promise<ServiceOptionsResponse> => {
  try {
    const response = await api.get(`/service-options/${serviceId}`);
    return mapServiceOptionsResponse(response.data);
  } catch (error) {
    throw toApiError(error);
  }
};
