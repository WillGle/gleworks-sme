import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import CheckoutSwitch from "@components/Service/CheckoutSwitch";
import * as api from "@api";

vi.mock("@api", () => ({
  createOrder: vi.fn(),
  createOrderDetail: vi.fn(),
  getUser: vi.fn(),
  getUserId: vi.fn(),
  isAuthenticated: vi.fn(),
}));

const mockUser = {
  id: "user-1",
  firstName: "Gleam",
  lastName: "User",
  email: "user@example.com",
  phoneNumber: "0123456789",
  address: "123 Street",
  city: "Hanoi",
  role: "user",
};

const mockCheckoutData = {
  switchName: "Gateron Yellow",
  amount: 70,
  moddingPreferences: { Film: true, Lube: true },
  springPreference: "Stock",
  additionalNotes: "Handle with care",
  total: 500000,
};

describe("CheckoutSwitch Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (api.isAuthenticated as any).mockReturnValue(true);
    (api.getUserId as any).mockReturnValue("user-1");
  });

  it("fetches user info and displays checkout data from session storage", async () => {
    (api.getUser as any).mockResolvedValue(mockUser);
    sessionStorage.setItem("switchModdingData", JSON.stringify(mockCheckoutData));

    render(
      <MemoryRouter>
        <CheckoutSwitch />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading user information/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("User Gleam")).toBeInTheDocument();
      expect(screen.getByText("Gateron Yellow")).toBeInTheDocument();
      expect(screen.getByText("500,000 VND")).toBeInTheDocument();
      expect(screen.getByText("Film, Lube")).toBeInTheDocument();
    });
  });

  it("handles successful order creation and shows QR popup", async () => {
    (api.getUser as any).mockResolvedValue(mockUser);
    (api.createOrder as any).mockResolvedValue({ orderId: "new-order-id" });
    (api.createOrderDetail as any).mockResolvedValue({ id: "detail-id" });
    sessionStorage.setItem("switchModdingData", JSON.stringify(mockCheckoutData));

    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <CheckoutSwitch />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Proceed")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Proceed"));

    await waitFor(() => {
      expect(api.createOrder).toHaveBeenCalled();
      expect(api.createOrderDetail).toHaveBeenCalled();
      expect(screen.getByAltText("QR Code")).toBeInTheDocument();
    });
  });

  it("handles API failure during checkout", async () => {
    (api.getUser as any).mockResolvedValue(mockUser);
    (api.createOrder as any).mockRejectedValue(new Error("API Error"));
    sessionStorage.setItem("switchModdingData", JSON.stringify(mockCheckoutData));

    window.alert = vi.fn();
    console.error = vi.fn();

    render(
      <MemoryRouter>
        <CheckoutSwitch />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Proceed")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Proceed"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to save order. Please try again.");
    });
  });
});
