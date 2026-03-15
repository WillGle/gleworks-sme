// Covers the shared browser session helpers used by auth flows.
import {
  clearSession,
  getRole,
  getStoredUser,
  getToken,
  getUserId,
  isAuthenticated,
  setSession,
} from "../api"

test("setSession stores the expected auth keys", () => {
  setSession({
    id: "user-1",
    firstName: "Gleam",
    lastName: "User",
    email: "user@example.com",
    role: "admin",
    token: "token-123",
  })

  expect(getStoredUser()).toEqual({
    id: "user-1",
    firstName: "Gleam",
    lastName: "User",
    email: "user@example.com",
    role: "admin",
    token: "token-123",
  })
  expect(getUserId()).toBe("user-1")
  expect(getToken()).toBe("token-123")
  expect(getRole()).toBe("admin")
  expect(isAuthenticated()).toBe(true)
})

test("getStoredUser returns null for invalid JSON", () => {
  localStorage.setItem("user", "{broken")

  expect(getStoredUser()).toBeNull()
})

test("clearSession removes all managed auth keys", () => {
  setSession({
    id: "user-1",
    role: "user",
    token: "token-123",
  })

  clearSession()

  expect(getStoredUser()).toBeNull()
  expect(getUserId()).toBeNull()
  expect(getToken()).toBeNull()
  expect(getRole()).toBeNull()
  expect(isAuthenticated()).toBe(false)
})
