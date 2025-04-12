import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "6px",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        fontSize: "0.9rem",
        whiteSpace: "nowrap",
      }}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
