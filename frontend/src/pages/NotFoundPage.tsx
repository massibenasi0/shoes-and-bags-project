import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-4">
    <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Page not found</h2>
    <p className="text-gray-500 dark:text-gray-400 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link
      to="/"
      className="mt-4 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
    >
      Go back home
    </Link>
  </div>
);

export default NotFoundPage;
