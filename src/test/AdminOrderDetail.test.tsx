import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import AdminOrderDetail from "@components/UserPage/AdminOrderDetail";
import { getOrderDetails, updateOrderStatus } from "@api";

vi.mock("@api", () => ({
  getOrderDetails: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

const mockOrder = {
  orderId: "order-123",
  status: "Pending",
  paymentStatus: "Pending",
  totalCost: 150000,
  createdAt: "2024-01-01T10:00:00Z",
  address: "123 Main St",
  telephone: "0123456789",
  user: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  },
  fields: [
    { id: "f1", fieldName: "Switch Type", fieldValue: "Linear" },
    { id: "f2", fieldName: "Lube", fieldValue: "Krytox 205g0" },
  ],
};

const renderWithRouter = (orderId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/admin/order-detail/${orderId}`]}>
      <Routes>
        <Route path="/admin/order-detail/:orderId" element={<AdminOrderDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("AdminOrderDetail Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("renders loading state initially and then displays order data", async () => {
    (getOrderDetails as any).mockResolvedValue(mockOrder);

    renderWithRouter("order-123");

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("order-123")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("150,000 VND")).toBeInTheDocument();
      expect(screen.getByText("Switch Type")).toBeInTheDocument();
      expect(screen.getByText("Linear")).toBeInTheDocument();
    });
  });

  it("handles status changes and submission", async () => {
    (getOrderDetails as any).mockResolvedValue(mockOrder);
    (updateOrderStatus as any).mockResolvedValue({
      status: "Finished",
      paymentStatus: "Paid",
    });

    renderWithRouter("order-123");

    await waitFor(() => expect(screen.getByText("order-123")).toBeInTheDocument());

    const statusSelect = screen.getByLabelText(/Order Status/i);
    const paymentSelect = screen.getByLabelText(/Payment Status/i);
    const submitBtn = screen.getByRole("button", { name: /Submit/i });

    fireEvent.change(statusSelect, { target: { value: "Finished" } });
    fireEvent.change(paymentSelect, { target: { value: "Paid" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(updateOrderStatus).toHaveBeenCalledWith("order-123", {
        status: "Finished",
        paymentStatus: "Paid",
      });
      expect(statusSelect).toHaveValue("Finished");
      expect(paymentSelect).toHaveValue("Paid");
    });
  });

  it("displays an error message when the order is not found", async () => {
    (getOrderDetails as any).mockRejectedValue(new Error("Not found"));

    renderWithRouter("order-nonexistent");

    await waitFor(() => {
      expect(screen.getByText(/No order details found/i)).toBeInTheDocument();
    });
  });

  it("uses cached data from sessionStorage if available", async () => {
    sessionStorage.setItem("order_order-123", JSON.stringify(mockOrder));

    renderWithRouter("order-123");

    // Should render immediately without calling the API
    expect(screen.getByText("order-123")).toBeInTheDocument();
    expect(getOrderDetails).not.toHaveBeenCalled();
  });
});
