import React, { useEffect } from "react";
import { useAppSelector } from "../store/hooks";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
};
