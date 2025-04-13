import React, { createContext, useState, useEffect } from "react";

// Create the context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch (err) {
      console.warn("Unable to access localStorage for theme:", err);
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    try {
      document.body.style.backgroundColor = theme === "dark" ? "#121212" : "#ffffff";
      document.body.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    } catch (err) {
      console.warn("Unable to persist theme:", err);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
