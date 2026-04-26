import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store";
import LoginForm from "../../components/auth/LoginForm";
import "../../i18n";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}><BrowserRouter>{children}</BrowserRouter></Provider>
);

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm />, { wrapper: Wrapper });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(<LoginForm />, { wrapper: Wrapper });
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    render(<LoginForm />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email required/i)).toBeInTheDocument();
    });
  });

  it("renders a link to the Google login", () => {
    render(<LoginForm />, { wrapper: Wrapper });
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });
});
