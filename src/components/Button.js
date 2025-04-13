import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Button = ({ children, onClick, style = {}, type = "button" }) => {
  const { theme } = useContext(ThemeContext);

  const baseStyle = {
    padding: "0.75rem 1.25rem",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    background: theme === "dark" ? "#444" : "#007bff",
    color: theme === "dark" ? "#fff" : "#fff",
    ...style,
  };

  const hoverStyle = {
    background: theme === "dark" ? "#666" : "#0056b3",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={baseStyle}
      onMouseOver={(e) => (e.target.style.background = hoverStyle.background)}
      onMouseOut={(e) => (e.target.style.background = baseStyle.background)}
    >
      {children}
    </button>
  );
};

export default Button;
