import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import MyAccount from "@components/UserPage/MyAccount";
import * as api from "@api";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@api", () => ({
  authCheck: vi.fn(),
  getUser: vi.fn(),
  getUserId: vi.fn(),
  isAuthenticated: vi.fn(),
  updateUser: vi.fn(),
}));

const mockUser = {
  id: "user-1",
  firstName: "Gleam",
  lastName: "User",
  email: "user@example.com",
  phoneNumber: "0123456789",
  dateOfBirth: "2000-01-01",
  address: "123 Street",
  city: "Hanoi",
};

describe("MyAccount Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.isAuthenticated as any).mockReturnValue(true);
    (api.getUserId as any).mockReturnValue("user-1");
  });

  it("loads and displays user profile information", async () => {
    (api.getUser as any).mockResolvedValue(mockUser);
    render(<MemoryRouter><MyAccount /></MemoryRouter>);
    expect(await screen.findByDisplayValue("Gleam")).toBeInTheDocument();
  });

  it("handles profile updates successfully", async () => {
    (api.getUser as any).mockResolvedValue(mockUser);
    (api.updateUser as any).mockResolvedValue({ ...mockUser, firstName: "Updated" });

    render(<MemoryRouter><MyAccount /></MemoryRouter>);
    const input = await screen.findByPlaceholderText(/Your First Name/i);
    fireEvent.change(input, { target: { value: "Updated" } });
    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    expect(await screen.findByText(/Information updated successfully!/i)).toBeInTheDocument();
  });

  it("redirects to login if not authenticated", async () => {
    (api.isAuthenticated as any).mockReturnValue(false);
    render(<MemoryRouter><MyAccount /></MemoryRouter>);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("handles API error during profile fetch", async () => {
    (api.getUser as any).mockRejectedValue(new Error("Fail"));
    render(<MemoryRouter><MyAccount /></MemoryRouter>);
    expect(await screen.findByText(/Could not load user information/i)).toBeInTheDocument();
  });
});
