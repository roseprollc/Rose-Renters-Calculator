import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ textAlign: "right", marginBottom: "1rem" }}>
      <button
        onClick={toggleTheme}
        style={{
          padding: "0.5rem 1rem",
          background: theme === "light" ? "#222" : "#fff",
          color: theme === "light" ? "#fff" : "#222",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </div>
  );
};

export default ThemeToggle;
