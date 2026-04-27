import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AdminRoute } from "./AdminRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { Spinner } from "../components/common/Spinner";

// Lazy-loaded pages
const HomePage = lazy(() => import("../pages/HomePage"));
const ProductListPage = lazy(() => import("../pages/ProductListPage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const ContactPage = lazy(() => import("../pages/ContactPage"));

const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const OrdersPage = lazy(() => import("../pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("../pages/OrderDetailPage"));
const UserProfilePage = lazy(() => import("../pages/UserProfilePage"));
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<div className="flex items-center justify-center h-64"><Spinner /></div>}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
      },
      {
        path: "products",
        element: <SuspenseWrapper><ProductListPage /></SuspenseWrapper>,
      },
      {
        path: "products/:id",
        element: <SuspenseWrapper><ProductDetailPage /></SuspenseWrapper>,
      },
      {
        path: "cart",
        element: <SuspenseWrapper><CartPage /></SuspenseWrapper>,
      },
      {
        path: "login",
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
      },
      {
        path: "register",
        element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper><CheckoutPage /></SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper><OrdersPage /></SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper><OrderDetailPage /></SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper><UserProfilePage /></SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper>
          </AdminRoute>
        ),
      },
      {
        path: "contact",
        element: <SuspenseWrapper><ContactPage /></SuspenseWrapper>,
      },
      {
        path: "*",
        element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
      },
    ],
  },
]);
