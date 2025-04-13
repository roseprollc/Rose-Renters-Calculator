// src/components/UserBadge.js
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const UserBadge = () => {
  const { theme } = useContext(ThemeContext);
  const { auth } = useContext(AuthContext);
  const isDark = theme === "dark";

  const user = auth?.user;
  if (!user) return null;

  const displayName = user.email || user.name || user.sub || "User";

  return (
    <div
      style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        fontSize: "0.85rem",
        padding: "0.4rem 0.8rem",
        backgroundColor: isDark ? "#2a2a2a" : "#f3f4f6",
        borderRadius: "999px",
        color: isDark ? "#e5e7eb" : "#374151",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <span role="img" aria-label="user">👤</span>
      <span>{displayName}</span>
    </div>
  );
};

export default UserBadge;
