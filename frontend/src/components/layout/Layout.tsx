import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { borderRadius: "8px", fontSize: "14px" },
      }}
    />
  </div>
);
