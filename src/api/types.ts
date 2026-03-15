// Shared frontend models used by the API layer and screens.
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: string;
  token: string;
}

export interface SessionData {
  user: AuthUser;
  token: string;
  userId: string;
  role: "admin" | "user" | string;
}

export interface AuthCheckResult {
  userId: string;
  role?: string;
  user?: UserProfile | null;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  email: string;
  password: string;
}

export interface ForgotPasswordResponse {
  message?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  city: string;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  city: string;
}

export interface UserListItem extends UserProfile {
  createdAt: string;
  role: string;
  isConfirmed: number;
}

export interface ServiceSummary {
  id: number;
  name: string;
  description: string;
}

export interface ServiceOption {
  id: number;
  optionName: string;
  price: number;
  optionGroup: string;
}

export interface ServiceOptionsResponse {
  options: ServiceOption[];
}

export interface OrderUserSummary {
  firstName: string;
  lastName: string;
  email?: string;
}

export interface OrderServiceSummary {
  id?: number;
  name: string;
}

export interface OrderSummary {
  id?: string;
  orderId?: string;
  userId?: string;
  serviceId?: number;
  createdAt: string;
  totalCost: number;
  paymentStatus: string;
  status: string;
  address: string;
  telephone: string;
  serviceName?: string;
  user?: OrderUserSummary;
  service?: OrderServiceSummary;
}

export interface CreateOrderPayload {
  userId: string;
  serviceId: number;
  totalCost: number;
  status: string;
  paymentStatus: string;
  address: string;
  telephone: string;
}

export interface CreateOrderResponse {
  orderId: string;
}

export interface CreateOrderDetailPayload {
  orderId: string;
  fieldName: string;
  fieldValue: string | null;
}

export interface CreateOrderDetailResponse {
  id?: string;
  orderId?: string;
  fieldName?: string;
  fieldValue?: string | null;
  message?: string;
}

export interface UpdateOrderStatusPayload {
  status: string;
  paymentStatus: string;
}

export interface UpdateOrderStatusResponse {
  status: string;
  paymentStatus: string;
}

export interface OrderDetailField {
  id: string;
  fieldName: string;
  fieldValue: string;
}

export interface OrderDetailsResponse {
  orderId: string;
  status: string;
  paymentStatus: string;
  totalCost: number;
  createdAt: string;
  address: string;
  telephone: string;
  user: UserProfile | null;
  fields: OrderDetailField[];
}
