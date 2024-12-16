import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

test("renders the landing page", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText("GLE.WORK")).toBeInTheDocument();
});

test("renders the login page", () => {
  window.history.pushState({}, "Login Page", "/login");
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText("Login")).toBeInTheDocument();
});

test("renders the signup page", () => {
  window.history.pushState({}, "Signup Page", "/signup");
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText("Signup")).toBeInTheDocument();
});

test("renders the lost password page", () => {
  window.history.pushState({}, "Lost Password Page", "/lost-password");
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText("Lost Password")).toBeInTheDocument();
});

test("renders the not found page for unknown routes", () => {
  window.history.pushState({}, "Unknown Page", "/unknown");
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText("Page Not Found")).toBeInTheDocument();
});
