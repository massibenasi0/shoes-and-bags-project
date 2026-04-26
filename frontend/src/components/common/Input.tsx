import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          block w-full rounded-lg border px-3 py-2 text-sm
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
          ${error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 dark:border-gray-600"
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
