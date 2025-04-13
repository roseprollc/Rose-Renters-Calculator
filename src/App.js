import React, { useState, useContext, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AnalysisPage from "./AnalysisPage";
import SavedAnalyses from "./SavedAnalyses";
import ResultsChart from "./components/ResultsChart";
import GPTInsights from "./components/GPTInsights";
import { ThemeContext } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import UserBadge from "./components/UserBadge";
import InputForm from "./components/InputForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import LogoutButton from "./components/LogoutButton";
import LandingPage from "./pages/LandingPage";

function App() {
  const { theme } = useContext(ThemeContext);
  const resultRef = useRef();

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("prefillForm");
    return saved ? JSON.parse(saved) : {
      purchasePrice: "",
      downPayment: "",
      loanTerm: "",
      interestRate: "",
      monthlyRent: "",
      vacancyRate: "",
      propertyTax: "",
      insurance: "",
      repairs: "",
      managementFee: "",
      hoaFees: "",
      pmi: "",
      tags: "",
      arv: "",
      repairCosts: "",
      assignmentFee: "",
      buyerProfit: "",
      closingCosts: "",
      buffer: "",
    };
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("prefillResults");
    return saved ? JSON.parse(saved) : null;
  });

  const [mode, setMode] = useState("Rent");
  const [smartUrl, setSmartUrl] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSmartImport = () => {
    if (smartUrl.includes("zillow.com")) {
      toast.success("Zillow data imported successfully.");
      setForm((prev) => ({
        ...prev,
        purchasePrice: "350000",
        monthlyRent: "2400",
        propertyTax: "250",
        insurance: "100",
      }));
    } else if (smartUrl.includes("redfin.com")) {
      toast.success("Redfin data imported successfully.");
      setForm((prev) => ({
        ...prev,
        purchasePrice: "420000",
        monthlyRent: "2800",
        propertyTax: "300",
        insurance: "120",
      }));
    } else {
      toast.error("Unsupported URL. Try Zillow or Redfin.");
    }
  };

  const handleSaveAnalysis = async () => {
    try {
      const payload = {
        ...form,
        results,
        mode,
      };

      const res = await fetch("https://rose-renters-backend.onrender.com/api/analysis/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save analysis");

      toast.success("💾 Analysis saved to dashboard!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save analysis. Try again.");
    }
  };

  const getInputFields = () => {
    if (mode === "Wholesale") {
      return [
        { label: "ARV (After Repair Value)", name: "arv" },
        { label: "Repair Costs", name: "repairCosts" },
        { label: "Assignment Fee", name: "assignmentFee" },
        { label: "Buyer Profit Margin", name: "buyerProfit" },
        { label: "Closing Costs", name: "closingCosts" },
        { label: "Max Offer Buffer", name: "buffer" },
        { label: "Tags / Notes (Optional ZIP)", name: "tags" },
      ];
    }
    return [
      { label: "Purchase Price", name: "purchasePrice" },
      { label: "Down Payment (%)", name: "downPayment" },
      { label: "Loan Term (years)", name: "loanTerm" },
      { label: "Interest Rate (%)", name: "interestRate" },
      {
        label: mode === "Airbnb" ? "Nightly Rate" : "Monthly Rent",
        name: "monthlyRent",
      },
      {
        label: mode === "Airbnb" ? "Occupancy Rate (%)" : "Vacancy Rate (%)",
        name: "vacancyRate",
      },
      { label: "Monthly Property Tax", name: "propertyTax" },
      { label: "Monthly Insurance", name: "insurance" },
      { label: "Monthly Repairs", name: "repairs" },
      { label: "Monthly Management Fee", name: "managementFee" },
      { label: "Monthly HOA Fees", name: "hoaFees" },
      { label: "Monthly PMI", name: "pmi" },
      { label: "Tags / Notes (Optional ZIP)", name: "tags" },
    ];
  };

  const calculate = () => {
    // your existing calculate logic
  };

  const exportPDF = async () => {
    // your existing exportPDF logic
  };

  useEffect(() => {
    const prefill = localStorage.getItem("prefillForm");
    if (prefill) {
      const parsed = JSON.parse(prefill);
      if (parsed?.purchasePrice && parsed?.monthlyRent) {
        setForm(parsed);
        setTimeout(() => calculate(), 200);
      }
    }
    return () => {
      localStorage.removeItem("prefillForm");
      localStorage.removeItem("prefillResults");
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: theme === "dark" ? "#121212" : "#fff", color: theme === "dark" ? "#fff" : "#000", position: "relative" }}>
      <UserBadge />
      <div style={{ position: "absolute", top: "4rem", right: "1rem", zIndex: 999 }}>
        <ThemeToggle />
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/analysis/:id" element={<AnalysisPage />} />
        <Route path="/saved" element={<SavedAnalyses />} />
        <Route
          path="/renters"
          element={
            <ProtectedRoute>
              <div style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h1>Rose Renters Calc</h1>
                  <LogoutButton />
                </div>

                <div style={{ margin: "1rem 0", display: "flex", gap: "1rem" }}>
                  {["Rent", "Airbnb", "Wholesale"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        backgroundColor: mode === m ? "#3b82f6" : "#e5e7eb",
                        color: mode === m ? "#fff" : "#000",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <input
                    type="text"
                    value={smartUrl}
                    onChange={(e) => setSmartUrl(e.target.value)}
                    placeholder="Paste Zillow or Redfin URL"
                    style={{ width: "70%", padding: "0.5rem", marginRight: "0.5rem" }}
                  />
                  <button onClick={handleSmartImport} style={{ padding: "0.5rem 1rem" }}>
                    Smart Import
                  </button>
                </div>

                <InputForm form={form} handleChange={handleChange} inputFields={getInputFields()} />
                <button onClick={calculate} style={{ padding: "0.75rem", marginTop: "1rem" }}>Calculate</button>

                {results && (
                  <>
                    <div ref={resultRef} style={{ marginTop: "2rem", background: theme === "dark" ? "#1e1e1e" : "#f9f9f9", padding: "1.5rem", borderRadius: "10px", boxShadow: theme === "dark" ? "0 0 10px rgba(255,255,255,0.1)" : "0 0 10px rgba(0,0,0,0.05)" }}>
                      <h2 style={{ marginBottom: "1rem" }}>📊 Analysis Results</h2>
                      <div style={{ lineHeight: "1.8" }}>
                        {mode === "Wholesale" ? (
                          <p><strong>MAO (Max Allowable Offer):</strong> ${results.mao}</p>
                        ) : (
                          <>
                            <p><strong>Monthly Mortgage:</strong> ${results.mortgagePayment}</p>
                            <p><strong>Total Monthly Expenses:</strong> ${results.totalExpenses}</p>
                            <p><strong>Monthly Cash Flow:</strong> ${results.monthlyCashFlow}</p>
                            <p><strong>Annual Cash Flow:</strong> ${results.annualCashFlow}</p>
                            <p><strong>Cash-on-Cash ROI:</strong> {results.roi}%</p>
                            <p><strong>Cap Rate:</strong> {results.capRate}%</p>
                            <p><strong>Breakeven Monthly Rent:</strong> ${results.breakevenRent}</p>
                          </>
                        )}
                      </div>
                      {mode !== "Wholesale" && <ResultsChart results={results} />}
                      <GPTInsights results={results} mode={mode} />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
                      <button onClick={exportPDF} style={{ padding: "0.5rem 1rem" }}>Export as PDF</button>
                      <button onClick={handleSaveAnalysis} style={{ padding: "0.5rem 1rem", backgroundColor: "#10b981", color: "#fff" }}>Save Analysis</button>
                    </div>
                  </>
                )}
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
