// Verifies API modules call the right endpoints and return normalized data.
import { vi } from 'vitest'

const { mockGet, mockPost, mockPut } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
}))

vi.mock("../api/client", () => ({
  api: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
  },
}))

import {
  authCheck,
  createOrder,
  createOrderDetail,
  forgotPassword,
  getOrderDetails,
  getServiceOptions,
  getUser,
  listOrders,
  listServices,
  listUserOrders,
  listUsers,
  login,
  register,
  resetPassword,
  updateOrderStatus,
  updateUser,
} from "../api"

test("login posts credentials and returns a normalized auth user", async () => {
  mockPost.mockResolvedValue({
    data: {
      id: "1",
      first_name: "Gleam",
      last_name: "User",
      email: "user@example.com",
      role: "user",
      token: "token-123",
    },
  })

  await expect(login("user@example.com", "secret")).resolves.toEqual({
    id: "1",
    firstName: "Gleam",
    lastName: "User",
    email: "user@example.com",
    role: "user",
    token: "token-123",
  })
  expect(mockPost).toHaveBeenCalledWith("/auth/login", {
    email: "user@example.com",
    password: "secret",
  })
})

test("register posts the full payload and returns the backend response", async () => {
  const payload = {
    firstName: "A",
    lastName: "B",
    phoneNumber: "+84123",
    dateOfBirth: "2024-01-01",
    email: "user@example.com",
    password: "Secret1!",
  }
  mockPost.mockResolvedValue({ data: { message: "ok" } })

  await expect(register(payload)).resolves.toEqual({ message: "ok" })
  expect(mockPost).toHaveBeenCalledWith("/auth/register", payload)
})

test("forgotPassword and resetPassword call the expected auth endpoints", async () => {
  mockPost.mockResolvedValue({ data: { message: "sent" } })

  await expect(forgotPassword("user@example.com")).resolves.toEqual({
    message: "sent",
  })
  await expect(resetPassword("user-1", "Secret1!")).resolves.toEqual({
    message: "sent",
  })

  expect(mockPost).toHaveBeenNthCalledWith(1, "/auth/forgot-password", {
    email: "user@example.com",
  })
  expect(mockPost).toHaveBeenNthCalledWith(2, "/auth/reset-password/user-1", {
    newPassword: "Secret1!",
  })
})

test("authCheck and list endpoints return normalized data", async () => {
  mockGet
    .mockResolvedValueOnce({
      data: {
        user: {
          id: "user-1",
          role: "user",
          first_name: "Gleam",
          last_name: "User",
          email: "user@example.com",
          phone_number: "0123",
          date_of_birth: "2000-01-01",
          address: "A",
          city: "B",
        },
      },
    })
    .mockResolvedValueOnce({
      data: [
        {
          order_id: "order-1",
          user_id: "user-1",
          service_id: 2,
          created_at: "2024-01-02T00:00:00.000Z",
          total_cost: 150000,
          payment_status: "Paid",
          order_status: "Finished",
          address: "123 Test St",
          telephone: "0123",
          User: { firstName: "Gleam", lastName: "User" },
          Service: { id: 2, name: "Build" },
        },
      ],
    })
    .mockResolvedValueOnce({
      data: [
        {
          order_id: "order-2",
          created_at: "2024-01-03T00:00:00.000Z",
          total_cost: 120000,
          payment_status: "Pending",
          order_status: "Pending",
          address: "456 Test St",
          telephone: "0999",
          Service: { id: 1, name: "Switch" },
        },
      ],
    })
    .mockResolvedValueOnce({
      data: [{ id: 1, name: "Switch", description: "Switch service" }],
    })
    .mockResolvedValueOnce({
      data: {
        options: [
          {
            id: 10,
            option_name: "Lubing",
            price: 1000,
            option_group: "Switch Modding Preference",
          },
        ],
      },
    })
    .mockResolvedValueOnce({
      data: [
        {
          id: "user-1",
          first_name: "Gleam",
          last_name: "User",
          phone_number: "0123",
          email: "user@example.com",
          date_of_birth: "2000-01-01",
          address: "A",
          city: "B",
          created_at: "2024-01-01T00:00:00.000Z",
          role: "user",
          is_confirmed: 1,
        },
      ],
    })
    .mockResolvedValueOnce({
      data: {
        id: "user-1",
        first_name: "Gleam",
        last_name: "User",
        phone_number: "0123",
        email: "user@example.com",
        date_of_birth: "2000-01-01",
        address: "A",
        city: "B",
      },
    })
    .mockResolvedValueOnce({
      data: [
        {
          orderId: "order-1",
          Order: {
            orderId: "order-1",
            status: "Ongoing",
            paymentStatus: "Pending",
            totalCost: 150000,
            createdAt: "2024-01-04T00:00:00.000Z",
            address: "123 Test St",
            telephone: "0123",
            User: {
              id: "user-1",
              first_name: "Gleam",
              last_name: "User",
              phone_number: "0123",
              email: "user@example.com",
              date_of_birth: "2000-01-01",
              address: "A",
              city: "B",
            },
          },
          fieldName: "Switches",
          fieldValue: "MX Brown",
          id: "field-1",
        },
      ],
    })

  await expect(authCheck()).resolves.toEqual({
    userId: "user-1",
    role: "user",
    user: {
      id: "user-1",
      firstName: "Gleam",
      lastName: "User",
      phoneNumber: "0123",
      email: "user@example.com",
      dateOfBirth: "2000-01-01",
      address: "A",
      city: "B",
    },
  })
  await expect(listOrders()).resolves.toEqual([
    {
      id: undefined,
      orderId: "order-1",
      userId: "user-1",
      serviceId: 2,
      createdAt: "2024-01-02T00:00:00.000Z",
      totalCost: 150000,
      paymentStatus: "Paid",
      status: "Finished",
      address: "123 Test St",
      telephone: "0123",
      serviceName: "Build",
      user: { firstName: "Gleam", lastName: "User", email: "" },
      service: { id: 2, name: "Build" },
    },
  ])
  await expect(listUserOrders("user-1")).resolves.toEqual([
    {
      id: undefined,
      orderId: "order-2",
      userId: undefined,
      serviceId: undefined,
      createdAt: "2024-01-03T00:00:00.000Z",
      totalCost: 120000,
      paymentStatus: "Pending",
      status: "Pending",
      address: "456 Test St",
      telephone: "0999",
      serviceName: "Switch",
      user: undefined,
      service: { id: 1, name: "Switch" },
    },
  ])
  await expect(listServices()).resolves.toEqual([
    { id: 1, name: "Switch", description: "Switch service" },
  ])
  await expect(getServiceOptions(5)).resolves.toEqual({
    options: [
      {
        id: 10,
        optionName: "Lubing",
        price: 1000,
        optionGroup: "Switch Modding Preference",
      },
    ],
  })
  await expect(listUsers()).resolves.toEqual([
    {
      id: "user-1",
      firstName: "Gleam",
      lastName: "User",
      phoneNumber: "0123",
      email: "user@example.com",
      dateOfBirth: "2000-01-01",
      address: "A",
      city: "B",
      createdAt: "2024-01-01T00:00:00.000Z",
      role: "user",
      isConfirmed: 1,
    },
  ])
  await expect(getUser("user-1")).resolves.toEqual({
    id: "user-1",
    firstName: "Gleam",
    lastName: "User",
    phoneNumber: "0123",
    email: "user@example.com",
    dateOfBirth: "2000-01-01",
    address: "A",
    city: "B",
  })
  await expect(getOrderDetails("order-1")).resolves.toEqual({
    orderId: "order-1",
    status: "Ongoing",
    paymentStatus: "Pending",
    totalCost: 150000,
    createdAt: "2024-01-04T00:00:00.000Z",
    address: "123 Test St",
    telephone: "0123",
    user: {
      id: "user-1",
      firstName: "Gleam",
      lastName: "User",
      phoneNumber: "0123",
      email: "user@example.com",
      dateOfBirth: "2000-01-01",
      address: "A",
      city: "B",
    },
    fields: [
      {
        id: "field-1",
        fieldName: "Switches",
        fieldValue: "MX Brown",
      },
    ],
  })
})

test("order and user mutations use the correct payloads and normalized results", async () => {
  const orderPayload = {
    userId: "user-1",
    serviceId: 2,
    totalCost: 100,
    status: "Pending",
    paymentStatus: "Pending",
    address: "A",
    telephone: "0123",
  }
  const detailPayload = {
    orderId: "order-1",
    fieldName: "Switches",
    fieldValue: "MX Brown",
  }
  const statusPayload = { status: "done", paymentStatus: "paid" }
  const userPayload = {
    firstName: "Updated",
    lastName: "User",
    phoneNumber: "0999",
    email: "updated@example.com",
    dateOfBirth: "2000-01-01",
    address: "New",
    city: "City",
  }

  mockPost
    .mockResolvedValueOnce({ data: { order_id: "order-1" } })
    .mockResolvedValueOnce({
      data: {
        id: "detail-1",
        order_id: "order-1",
        field_name: "Switches",
        field_value: "MX Brown",
      },
    })
  mockPut
    .mockResolvedValueOnce({
      data: { order_status: "done", payment_status: "paid" },
    })
    .mockResolvedValueOnce({
      data: {
        id: "user-1",
        first_name: "Updated",
        last_name: "User",
        phone_number: "0999",
        email: "updated@example.com",
        date_of_birth: "2000-01-01",
        address: "New",
        city: "City",
      },
    })

  await expect(createOrder(orderPayload)).resolves.toEqual({
    orderId: "order-1",
  })
  await expect(createOrderDetail(detailPayload)).resolves.toEqual({
    id: "detail-1",
    orderId: "order-1",
    fieldName: "Switches",
    fieldValue: "MX Brown",
    message: undefined,
  })
  await expect(updateOrderStatus("order-1", statusPayload)).resolves.toEqual({
    status: "done",
    paymentStatus: "paid",
  })
  await expect(updateUser("user-1", userPayload)).resolves.toEqual({
    id: "user-1",
    firstName: "Updated",
    lastName: "User",
    phoneNumber: "0999",
    email: "updated@example.com",
    dateOfBirth: "2000-01-01",
    address: "New",
    city: "City",
  })

  expect(mockPost).toHaveBeenNthCalledWith(1, "/orders/", orderPayload)
  expect(mockPost).toHaveBeenNthCalledWith(2, "/order-details/", detailPayload)
  expect(mockPut).toHaveBeenNthCalledWith(
    1,
    "/orders/order-1/status",
    statusPayload
  )
  expect(mockPut).toHaveBeenNthCalledWith(2, "/users/user-1", userPayload)
})
