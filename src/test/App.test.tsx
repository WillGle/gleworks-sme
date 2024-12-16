import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};

test("renders the landing page", () => {
  renderWithRouter(<App />, { route: "/" });
  expect(screen.getByText("GLE.WORK")).toBeInTheDocument();
});

test("renders the login page", () => {
  renderWithRouter(<App />, { route: "/login" });
  expect(screen.getByText("Login")).toBeInTheDocument();
});

test("renders the signup page", () => {
  renderWithRouter(<App />, { route: "/signup" });
  expect(screen.getByText("Signup")).toBeInTheDocument();
});

test("renders the lost password page", () => {
  renderWithRouter(<App />, { route: "/lost-password" });
  expect(screen.getByText("Lost Password")).toBeInTheDocument();
});

test("renders the not found page for unknown routes", () => {
  renderWithRouter(<App />, { route: "/unknown" });
  expect(screen.getByText("Page Not Found")).toBeInTheDocument();
});
