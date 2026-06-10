// Covers the role-based account link in the shared header.
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, beforeEach, test, expect } from 'vitest'
import Header from '@components/Header'

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

describe("Header Component", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  test("renders login icon when no user is logged in", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "" })).toHaveAttribute("href", "/login");
    expect(screen.queryByText(/Hi,/i)).not.toBeInTheDocument();
  });

  test("routes admins to the dashboard and shows logout button", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "admin-1",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        token: "token-123",
      })
    );

    renderHeader();

    expect(screen.getByRole("link", { name: "Hi, User Admin" })).toHaveAttribute(
      "href",
      "/admin/dashboard"
    );
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
  });

  test("handles logout by clearing storage and redirecting", () => {
    localStorage.setItem("user", JSON.stringify({ id: "1", firstName: "A", role: "user" }));
    
    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { ...originalLocation, href: "" };

    renderHeader();

    const logoutBtn = screen.getByRole("button", { name: /Logout/i });
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem("user")).toBeNull();
    expect(window.location.href).toBe("/login");

    (window as any).location = originalLocation;
  });

  test("routes regular users to my-account", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "user-1",
        firstName: "Gleam",
        lastName: "User",
        role: "user",
        token: "token-123",
      })
    );

    renderHeader();

    expect(screen.getByRole("link", { name: "Hi, User Gleam" })).toHaveAttribute(
      "href",
      "/user/my-account"
    );
  });
});
