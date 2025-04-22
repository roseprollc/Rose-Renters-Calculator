import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setTheme(saved || (prefersDark ? "dark" : "light"));
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    document.body.style.backgroundColor = theme === "dark" ? "#121212" : "#ffffff";
    localStorage.setItem("theme", theme);
  }, [theme, hasMounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Prevent rendering until after client-side hydration
  if (!hasMounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
