// Covers the normalization helpers that hide backend field differences.
import {
  mapOrderDetailsResponse,
  mapOrderSummary,
} from "../api/mappers"

test("mapOrderSummary normalizes snake_case order fields", () => {
  expect(
    mapOrderSummary({
      order_id: "order-1",
      user_id: "user-1",
      service_id: 2,
      created_at: "2024-01-01T00:00:00.000Z",
      total_cost: 250000,
      payment_status: "Paid",
      order_status: "Finished",
      address: "123 Test St",
      telephone: "0123",
      User: { first_name: "Gleam", last_name: "User" },
      Service: { id: 2, name: "Build" },
    })
  ).toEqual({
    id: undefined,
    orderId: "order-1",
    userId: "user-1",
    serviceId: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
    totalCost: 250000,
    paymentStatus: "Paid",
    status: "Finished",
    address: "123 Test St",
    telephone: "0123",
    serviceName: "Build",
    user: { firstName: "Gleam", lastName: "User", email: "" },
    service: { id: 2, name: "Build" },
  })
})

test("mapOrderDetailsResponse returns a safe empty shape for malformed data", () => {
  expect(mapOrderDetailsResponse(null)).toEqual({
    orderId: "",
    status: "",
    paymentStatus: "",
    totalCost: 0,
    createdAt: "",
    address: "",
    telephone: "",
    user: null,
    fields: [],
  })
})
