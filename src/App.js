import React, { useContext, useRef, useState, useEffect } from "react";
import { ThemeContext } from "./context/ThemeContext";
import UserBadge from "./components/UserBadge";
import ThemeToggle from "./components/ThemeToggle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ children }) {
  const { theme } = useContext(ThemeContext);
  const resultRef = useRef();

  const [form, setForm] = useState({});
  const [results, setResults] = useState(null);

  useEffect(() => {
    try {
      const savedForm = typeof window !== "undefined" && localStorage.getItem("prefillForm");
      const savedResults = typeof window !== "undefined" && localStorage.getItem("prefillResults");

      if (savedForm) {
        const parsed = JSON.parse(savedForm);
        setForm(parsed);
      }

      if (savedResults) {
        setResults(JSON.parse(savedResults));
      }
    } catch (err) {
      console.warn("Error loading from localStorage:", err);
    }

    return () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("prefillForm");
        localStorage.removeItem("prefillResults");
      }
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme === "dark" ? "#121212" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
        position: "relative",
      }}
    >
      <UserBadge />
      <div style={{ position: "absolute", top: "4rem", right: "1rem", zIndex: 999 }}>
        <ThemeToggle />
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
      {children}
    </div>
  );
}

export default App;
