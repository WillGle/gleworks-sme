// Order API calls plus normalization for admin and user screens.
import { api } from "./client";
import { toApiError } from "./errors";
import {
  mapCreateOrderDetailResponse,
  mapCreateOrderResponse,
  mapOrderDetailsResponse,
  mapOrderSummary,
  mapUpdateOrderStatusResponse,
} from "./mappers";
import type {
  CreateOrderDetailPayload,
  CreateOrderDetailResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  OrderDetailsResponse,
  OrderSummary,
  UpdateOrderStatusPayload,
  UpdateOrderStatusResponse,
} from "./types";

export const listOrders = async (): Promise<OrderSummary[]> => {
  try {
    const response = await api.get("/orders");
    return Array.isArray(response.data)
      ? response.data.map(mapOrderSummary)
      : [];
  } catch (error) {
    throw toApiError(error);
  }
};

export const listUserOrders = async (userId: string): Promise<OrderSummary[]> => {
  try {
    const response = await api.get(`/orders/user/${userId}`);
    return Array.isArray(response.data)
      ? response.data.map(mapOrderSummary)
      : [];
  } catch (error) {
    throw toApiError(error);
  }
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> => {
  try {
    const response = await api.post("/orders/", payload);
    return mapCreateOrderResponse(response.data);
  } catch (error) {
    throw toApiError(error);
  }
};

export const createOrderDetail = async (
  payload: CreateOrderDetailPayload
): Promise<CreateOrderDetailResponse> => {
  try {
    const response = await api.post("/order-details/", payload);
    return mapCreateOrderDetailResponse(response.data);
  } catch (error) {
    throw toApiError(error);
  }
};

export const getOrderDetails = async (
  orderId: string
): Promise<OrderDetailsResponse> => {
  try {
    const response = await api.get(`/order-details/${orderId}`);
    return mapOrderDetailsResponse(response.data);
  } catch (error) {
    throw toApiError(error);
  }
};

export const updateOrderStatus = (
  orderId: string,
  payload: UpdateOrderStatusPayload
): Promise<UpdateOrderStatusResponse> =>
  api
    .put(`/orders/${orderId}/status`, payload)
    .then((res) => mapUpdateOrderStatusResponse(res.data))
    .catch((error) => {
      throw toApiError(error);
    });
