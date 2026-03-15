// Covers the app-level toast that reacts to shared API error events.
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { emitGlobalApiError } from "@api";
import GlobalApiErrorToast from "@components/GlobalApiErrorToast";

// Minimal route shell so the toast can navigate during the test.
const renderToast = (initialRoute = "/home") =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <GlobalApiErrorToast />
      <Routes>
        <Route path="/home" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/user/orders" element={<div>User orders</div>} />
      </Routes>
    </MemoryRouter>
  );

test("shows one shared toast for server errors", async () => {
  renderToast();

  act(() => {
    emitGlobalApiError({
      message: "Server is unavailable.",
      status: 500,
    });
  });
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(screen.getByText("Request failed")).toBeInTheDocument();
  expect(screen.getByText("Server is unavailable.")).toBeInTheDocument();
});

test("clears the session and returns to login after an authenticated 401", async () => {
  localStorage.setItem("user", JSON.stringify({ id: "user-1", token: "token-123" }));
  localStorage.setItem("userId", "user-1");
  localStorage.setItem("token", "token-123");
  localStorage.setItem("role", "user");

  renderToast("/user/orders");

  act(() => {
    emitGlobalApiError({
      message: "Unauthorized",
      status: 401,
      shouldLogout: true,
    });
  });

  expect(await screen.findByText("Session expired")).toBeInTheDocument();
  expect(
    screen.getByText("Your session has expired. Please log in again.")
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  expect(localStorage.getItem("user")).toBeNull();
  expect(localStorage.getItem("userId")).toBeNull();
  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("role")).toBeNull();
});
