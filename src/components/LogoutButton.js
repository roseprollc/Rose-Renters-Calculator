import React, { useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <button onClick={handleLogout}>
      🚪 Logout
    </button>
  );
};

export default LogoutButton;
