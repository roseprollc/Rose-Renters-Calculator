import React from "react";
import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>🚫 Not Authorized</h1>
      <p style={{ marginTop: "1rem" }}>
        You must be logged in to access this page.
      </p>
      <Link
        to="/login"
        style={{
          marginTop: "2rem",
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#6c63ff",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "600",
        }}
      >
        Go to Login
      </Link>
    </div>
  );
};

export default NotAuthorized;
