import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store";
import ProductCard from "../../components/product/ProductCard";
import "../../i18n";

const mockProduct = {
  id: "p1",
  name: "Classic Sneaker",
  slug: "classic-sneaker",
  description: "A classic shoe",
  price: 129.99,
  compare_at_price: null,
  category_id: "c1",
  images: ["https://placehold.co/400x400"],
  sizes: ["40"],
  colors: ["White"],
  stock: 10,
  is_featured: true,
  is_active: true,
  brand: "TestBrand",
  created_at: "2024-01-01T00:00:00Z",
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}><BrowserRouter>{children}</BrowserRouter></Provider>
);

describe("ProductCard", () => {
  it("renders the product name", () => {
    render(<ProductCard product={mockProduct} />, { wrapper: Wrapper });
    expect(screen.getByText("Classic Sneaker")).toBeInTheDocument();
  });

  it("renders the formatted price", () => {
    render(<ProductCard product={mockProduct} />, { wrapper: Wrapper });
    expect(screen.getByText("$129.99")).toBeInTheDocument();
  });

  it("renders the brand", () => {
    render(<ProductCard product={mockProduct} />, { wrapper: Wrapper });
    expect(screen.getByText("TestBrand")).toBeInTheDocument();
  });

  it("links to the product detail page", () => {
    render(<ProductCard product={mockProduct} />, { wrapper: Wrapper });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/p1");
  });

  it("shows out-of-stock overlay when stock is 0", () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} />, { wrapper: Wrapper });
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it("shows sale badge when compare_at_price is set", () => {
    render(<ProductCard product={{ ...mockProduct, compare_at_price: 159.99 }} />, { wrapper: Wrapper });
    expect(screen.getByText(/-\d+%/)).toBeInTheDocument();
  });
});
