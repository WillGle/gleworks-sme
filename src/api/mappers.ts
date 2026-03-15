// Normalizes backend payloads into frontend-friendly models.
import type {
  AuthCheckResult,
  AuthUser,
  CreateOrderDetailResponse,
  CreateOrderResponse,
  OrderDetailField,
  OrderDetailsResponse,
  OrderServiceSummary,
  OrderSummary,
  OrderUserSummary,
  ServiceOption,
  ServiceOptionsResponse,
  ServiceSummary,
  UpdateOrderStatusResponse,
  UserListItem,
  UserProfile,
} from "./types";

type JsonObject = { [key: string]: unknown };

const isObject = (value: unknown): value is JsonObject =>
  typeof value === "object" && value !== null;

const getValue = (object: JsonObject | null, ...keys: string[]): unknown => {
  if (!object) {
    return undefined;
  }

  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null) {
      return object[key];
    }
  }

  return undefined;
};

const asString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
};

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const mapOrderUserSummary = (raw: unknown): OrderUserSummary | undefined => {
  if (!isObject(raw)) {
    return undefined;
  }

  return {
    firstName: asString(getValue(raw, "firstName", "first_name")),
    lastName: asString(getValue(raw, "lastName", "last_name")),
    email: asString(getValue(raw, "email"), ""),
  };
};

const mapOrderServiceSummary = (raw: unknown): OrderServiceSummary | undefined => {
  if (!isObject(raw)) {
    return undefined;
  }

  return {
    id: asNumber(getValue(raw, "id"), 0) || undefined,
    name: asString(getValue(raw, "name")),
  };
};

export const mapAuthUser = (raw: unknown): AuthUser => {
  const source = isObject(raw) ? raw : null;

  return {
    id: asString(getValue(source, "id", "userId", "user_id")),
    firstName: asString(getValue(source, "firstName", "first_name"), "") || undefined,
    lastName: asString(getValue(source, "lastName", "last_name"), "") || undefined,
    email: asString(getValue(source, "email"), "") || undefined,
    role: asString(getValue(source, "role")),
    token: asString(getValue(source, "token", "accessToken", "access_token")),
  };
};

export const mapAuthCheckResult = (raw: unknown): AuthCheckResult => {
  const source = isObject(raw) ? raw : null;
  const nestedUser = isObject(getValue(source, "user")) ? (getValue(source, "user") as JsonObject) : null;
  const userId = asString(
    getValue(source, "userId", "user_id", "id") ?? getValue(nestedUser, "id", "userId", "user_id")
  );

  return {
    userId,
    role: asString(getValue(source, "role") ?? getValue(nestedUser, "role"), "") || undefined,
    user: nestedUser ? mapUserProfile(nestedUser) : null,
  };
};

export const mapUserProfile = (raw: unknown): UserProfile => {
  const source = isObject(raw) ? raw : null;

  return {
    id: asString(getValue(source, "id", "userId", "user_id")),
    firstName: asString(getValue(source, "firstName", "first_name")),
    lastName: asString(getValue(source, "lastName", "last_name")),
    phoneNumber: asString(getValue(source, "phoneNumber", "phone_number")),
    email: asString(getValue(source, "email")),
    dateOfBirth: asString(getValue(source, "dateOfBirth", "date_of_birth")),
    address: asString(getValue(source, "address")),
    city: asString(getValue(source, "city")),
  };
};

export const mapUserListItem = (raw: unknown): UserListItem => {
  const source = isObject(raw) ? raw : null;
  const profile = mapUserProfile(source);

  return {
    ...profile,
    createdAt: asString(getValue(source, "createdAt", "created_at")),
    role: asString(getValue(source, "role")),
    isConfirmed: asNumber(getValue(source, "isConfirmed", "is_confirmed")),
  };
};

export const mapServiceSummary = (raw: unknown): ServiceSummary => {
  const source = isObject(raw) ? raw : null;

  return {
    id: asNumber(getValue(source, "id")),
    name: asString(getValue(source, "name")),
    description: asString(getValue(source, "description")),
  };
};

export const mapServiceOption = (raw: unknown): ServiceOption => {
  const source = isObject(raw) ? raw : null;

  return {
    id: asNumber(getValue(source, "id")),
    optionName: asString(getValue(source, "optionName", "option_name")),
    price: asNumber(getValue(source, "price")),
    optionGroup: asString(getValue(source, "optionGroup", "option_group")),
  };
};

export const mapServiceOptionsResponse = (raw: unknown): ServiceOptionsResponse => {
  if (Array.isArray(raw)) {
    return {
      options: raw.map(mapServiceOption),
    };
  }

  const source = isObject(raw) ? raw : null;
  const options = Array.isArray(getValue(source, "options"))
    ? (getValue(source, "options") as unknown[])
    : [];

  return {
    options: options.map(mapServiceOption),
  };
};

export const mapOrderSummary = (raw: unknown): OrderSummary => {
  const source = isObject(raw) ? raw : null;
  const user = mapOrderUserSummary(getValue(source, "user", "User"));
  const service = mapOrderServiceSummary(getValue(source, "service", "Service"));

  return {
    id: asString(getValue(source, "id"), "") || undefined,
    orderId: asString(getValue(source, "orderId", "order_id"), "") || undefined,
    userId: asString(getValue(source, "userId", "user_id"), "") || undefined,
    serviceId: asNumber(getValue(source, "serviceId", "service_id"), 0) || undefined,
    createdAt: asString(getValue(source, "createdAt", "created_at")),
    totalCost: asNumber(getValue(source, "totalCost", "total_cost")),
    paymentStatus: asString(getValue(source, "paymentStatus", "payment_status")),
    status: asString(getValue(source, "status", "order_status")),
    address: asString(getValue(source, "address")),
    telephone: asString(getValue(source, "telephone")),
    serviceName: service?.name,
    user,
    service,
  };
};

export const mapCreateOrderResponse = (raw: unknown): CreateOrderResponse => {
  const source = isObject(raw) ? raw : null;

  return {
    orderId: asString(getValue(source, "orderId", "order_id", "id")),
  };
};

export const mapCreateOrderDetailResponse = (
  raw: unknown
): CreateOrderDetailResponse => {
  const source = isObject(raw) ? raw : null;

  return {
    id: asString(getValue(source, "id"), "") || undefined,
    orderId: asString(getValue(source, "orderId", "order_id"), "") || undefined,
    fieldName: asString(getValue(source, "fieldName", "field_name"), "") || undefined,
    fieldValue:
      asString(getValue(source, "fieldValue", "field_value"), "") || undefined,
    message: asString(getValue(source, "message"), "") || undefined,
  };
};

export const mapUpdateOrderStatusResponse = (
  raw: unknown
): UpdateOrderStatusResponse => {
  const source = isObject(raw) ? raw : null;

  return {
    status: asString(getValue(source, "status", "order_status")),
    paymentStatus: asString(getValue(source, "paymentStatus", "payment_status")),
  };
};

export const mapOrderDetailsResponse = (raw: unknown): OrderDetailsResponse => {
  const items = Array.isArray(raw) ? raw : [];
  const firstItem = items.length > 0 && isObject(items[0]) ? items[0] : null;
  const order = isObject(getValue(firstItem, "Order")) ? (getValue(firstItem, "Order") as JsonObject) : null;
  const nestedUser = isObject(getValue(order, "User")) ? (getValue(order, "User") as JsonObject) : null;

  const fields: OrderDetailField[] = items
    .filter(isObject)
    .filter((item) => asString(getValue(item, "fieldName", "field_name")) !== "")
    .map((item) => ({
      id: asString(getValue(item, "id", "fieldId", "field_id")),
      fieldName: asString(getValue(item, "fieldName", "field_name")),
      fieldValue: asString(getValue(item, "fieldValue", "field_value")),
    }));

  return {
    orderId: asString(
      getValue(firstItem, "orderId", "order_id") ?? getValue(order, "orderId", "order_id", "id")
    ),
    status: asString(getValue(order, "status", "order_status")),
    paymentStatus: asString(getValue(order, "paymentStatus", "payment_status")),
    totalCost: asNumber(getValue(order, "totalCost", "total_cost")),
    createdAt: asString(getValue(order, "createdAt", "created_at")),
    address: asString(getValue(order, "address")),
    telephone: asString(getValue(order, "telephone")),
    user: nestedUser ? mapUserProfile(nestedUser) : null,
    fields,
  };
};
