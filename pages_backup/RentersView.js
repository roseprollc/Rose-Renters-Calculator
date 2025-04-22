import React, { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from "../src/context/ThemeContext";
import LogoutButton from "../src/components/LogoutButton";
import InputForm from "../src/components/InputForm";
import ResultsChart from "../src/components/ResultsChart";
import GPTInsights from "../src/components/GPTInsights";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import withAuth from "../src/utils/withAuth";
import Link from "next/link";

const RentersView = () => {
  const { theme } = useContext(ThemeContext);
  const resultRef = useRef();

  const [form, setForm] = useState(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem("prefillForm");
    return saved ? JSON.parse(saved) : {
      purchasePrice: "400000", 
      downPayment: "20", 
      loanTerm: "30", 
      interestRate: "6.5",
      monthlyRent: "2500", 
      vacancyRate: "5", 
      propertyTax: "250", 
      insurance: "100",
      repairs: "100", 
      managementFee: "0", 
      hoaFees: "0", 
      pmi: "0", 
      tags: "",
      arv: "500000", 
      repairCosts: "50000", 
      assignmentFee: "10000", 
      buyerProfit: "10",
      closingCosts: "5000", 
      buffer: "5000"
    };
  });

  const [results, setResults] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("prefillResults");
    return saved ? JSON.parse(saved) : {
      mortgagePayment: "2018.77",
      totalExpenses: "2468.77",
      monthlyCashFlow: "31.23",
      annualCashFlow: "374.76",
      roi: "0.47",
      capRate: "3.8",
      breakevenRent: "2468.77",
      mao: "320000"
    };
  });

  const [mode, setMode] = useState("Rent");
  const [smartUrl, setSmartUrl] = useState("");

  // Preserve the existing styling approach but use the dark theme from the image
  const techno = {
    bg: "#000000", // Black background as shown in the image
    text: "#2ecc71", // Green text as shown in the image
    panel: "#111111",
    border: "#2ecc71",
    glow: "0 0 8px #2ecc71",
    buttonBg: "#2ecc71",
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSmartImport = () => {
    if (smartUrl.includes("zillow.com")) {
      toast.success("Zillow data imported.");
      setForm((prev) => ({
        ...prev,
        purchasePrice: "350000",
        monthlyRent: "2400",
        propertyTax: "250",
        insurance: "100",
      }));
    } else if (smartUrl.includes("redfin.com")) {
      toast.success("Redfin data imported.");
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
    // Preserve existing calculation logic
    let mortgagePayment = 0;
    let totalExpenses = 0;
    let monthlyCashFlow = 0;
    let annualCashFlow = 0;
    let roi = 0;
    let capRate = 0;
    let breakevenRent = 0;
    let mao = 0;

    if (mode === "Wholesale") {
      // Wholesale calculation
      const arv = parseFloat(form.arv) || 0;
      const repairCosts = parseFloat(form.repairCosts) || 0;
      const assignmentFee = parseFloat(form.assignmentFee) || 0;
      const buyerProfit = parseFloat(form.buyerProfit) || 0;
      const closingCosts = parseFloat(form.closingCosts) || 0;
      const buffer = parseFloat(form.buffer) || 0;

      mao = arv * 0.7 - repairCosts - assignmentFee - (arv * (buyerProfit / 100)) - closingCosts - buffer;
      
      setResults({
        mao: mao.toFixed(2)
      });
    } else {
      // Rent or Airbnb calculation
      const purchasePrice = parseFloat(form.purchasePrice) || 0;
      const downPaymentPercent = parseFloat(form.downPayment) || 0;
      const loanTerm = parseFloat(form.loanTerm) || 30;
      const interestRate = parseFloat(form.interestRate) || 0;
      const monthlyRent = parseFloat(form.monthlyRent) || 0;
      const vacancyRate = parseFloat(form.vacancyRate) || 0;
      const propertyTax = parseFloat(form.propertyTax) || 0;
      const insurance = parseFloat(form.insurance) || 0;
      const repairs = parseFloat(form.repairs) || 0;
      const managementFee = parseFloat(form.managementFee) || 0;
      const hoaFees = parseFloat(form.hoaFees) || 0;
      const pmi = parseFloat(form.pmi) || 0;

      const downPayment = purchasePrice * (downPaymentPercent / 100);
      const loanAmount = purchasePrice - downPayment;
      const monthlyInterestRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      // Calculate mortgage payment
      if (interestRate > 0) {
        mortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      } else {
        mortgagePayment = loanAmount / numberOfPayments;
      }

      // Calculate effective rent (accounting for vacancy)
      const effectiveRent = monthlyRent * (1 - vacancyRate / 100);
      
      // Calculate total expenses
      totalExpenses = mortgagePayment + propertyTax + insurance + repairs + managementFee + hoaFees + pmi;
      
      // Calculate cash flow
      monthlyCashFlow = effectiveRent - totalExpenses;
      annualCashFlow = monthlyCashFlow * 12;
      
      // Calculate ROI
      roi = (annualCashFlow / downPayment) * 100;
      
      // Calculate cap rate
      const annualIncome = effectiveRent * 12;
      const annualExpensesWithoutMortgage = (propertyTax + insurance + repairs + managementFee + hoaFees) * 12;
      const netOperatingIncome = annualIncome - annualExpensesWithoutMortgage;
      capRate = (netOperatingIncome / purchasePrice) * 100;
      
      // Calculate breakeven rent
      breakevenRent = totalExpenses;

      setResults({
        mortgagePayment: mortgagePayment.toFixed(2),
        totalExpenses: totalExpenses.toFixed(2),
        monthlyCashFlow: monthlyCashFlow.toFixed(2),
        annualCashFlow: annualCashFlow.toFixed(2),
        roi: roi.toFixed(2),
        capRate: capRate.toFixed(2),
        breakevenRent: breakevenRent.toFixed(2)
      });
    }

    // Save to localStorage
    localStorage.setItem("prefillForm", JSON.stringify(form));
    localStorage.setItem("prefillResults", JSON.stringify(results));
  };

  const exportPDF = async () => {
    if (!resultRef.current) return;
    
    try {
      const canvas = await html2canvas(resultRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('roseintel-analysis.pdf');
      
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Failed to export PDF");
    }
  };

  const handleSaveAnalysis = async () => {
    try {
      const payload = {
        ...form,
        results,
        mode,
      };

      const res = await fetch("/api/analysis/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("💾 Saved to Dashboard!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("❌ Failed to save analysis");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: techno.bg, 
      color: techno.text, 
      padding: "2rem", 
      fontFamily: "'Fira Mono', monospace" 
    }}>
      <ToastContainer position="top-center" autoClose={3000} />
      <div style={{ maxWidth: 700, margin: "auto" }}>
        {/* Header with Logo and Login */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "1.5rem" 
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.5rem" }}
            >
              <path
                d="M12 22C12 22 20 18 20 11V5L12 2L4 5V11C4 18 12 22 12 22Z"
                stroke={techno.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6C9.5 6 8 7.5 8 10C8 11.5 8.7 12.8 10 13.5V15H14V13.5C15.2 12.8 16 11.5 16 10C16 7.5 14.5 6 12 6Z"
                stroke={techno.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V4"
                stroke={techno.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 15H14"
                stroke={techno.text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 style={{ color: techno.text, margin: 0 }}>RoseIntel</h1>
          </div>
          <LogoutButton />
        </div>

        {/* Main Title */}
        <h2 style={{ 
          fontSize: "2rem", 
          marginBottom: "1.5rem", 
          color: techno.text 
        }}>
          Rental Property Analyzer
        </h2>

        {/* Calculator Mode Buttons */}
        <div style={{ 
          display: "flex", 
          gap: "1rem", 
          marginBottom: "1.5rem",
          justifyContent: "space-between" 
        }}>
          {["Rent", "Airbnb", "Wholesale"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "6px",
                backgroundColor: mode === m ? techno.buttonBg : "transparent",
                color: mode === m ? "#000" : techno.text,
                border: `2px solid ${techno.border}`,
                boxShadow: mode === m ? techno.glow : "none",
                cursor: "pointer",
                flex: 1,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Smart Import */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            value={smartUrl}
            onChange={(e) => setSmartUrl(e.target.value)}
            placeholder="Paste Zillow or Redfin URL"
            style={{
              width: "70%",
              padding: "0.75rem",
              marginRight: "0.5rem",
              backgroundColor: "#111",
              color: techno.text,
              border: `2px solid ${techno.border}`,
              borderRadius: "6px",
            }}
          />
          <button 
            onClick={handleSmartImport} 
            style={{ 
              padding: "0.75rem 1rem", 
              backgroundColor: techno.buttonBg, 
              color: "#000", 
              border: "none", 
              borderRadius: "6px",
              fontWeight: "bold"
            }}
          >
            Smart Import
          </button>
        </div>

        {/* Custom Input Form - Styled to match the image */}
        <div style={{ marginBottom: "1.5rem" }}>
          {getInputFields().slice(0, 3).map((field) => (
            <div key={field.name} style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
              <label style={{ width: "40%", fontSize: "1.2rem" }}>{field.label}</label>
              <div style={{ 
                display: "flex", 
                width: "60%", 
                border: `2px solid ${techno.border}`,
                borderRadius: "6px",
                overflow: "hidden"
              }}>
                <span style={{ 
                  padding: "0.75rem 1rem", 
                  backgroundColor: "transparent",
                  color: techno.text,
                  borderRight: `2px solid ${techno.border}`
                }}>
                  {field.name === "interestRate" ? "%" : "$"}
                </span>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: "transparent",
                    color: techno.text,
                    border: "none",
                    outline: "none",
                    fontSize: "1.1rem"
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button 
            onClick={calculate} 
            style={{ 
              padding: "0.75rem 2.5rem", 
              backgroundColor: "transparent", 
              color: techno.text, 
              border: `2px solid ${techno.border}`, 
              borderRadius: "6px", 
              fontSize: "1.2rem",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Calculate
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Estimated Monthly Cost</h3>
              <p style={{ fontSize: "1.5rem" }}>
                $ {mode === "Wholesale" ? results.mao : results.mortgagePayment}
              </p>
            </div>

            {/* Property Preview */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Property Preview</h3>
              <div style={{ 
                border: `2px solid ${techno.border}`,
                borderRadius: "10px",
                overflow: "hidden"
              }}>
                <img
                  src="/placeholder.svg?height=300&width=600&query=house"
                  alt="Property Preview"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>

            {/* Save Button */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <button 
                onClick={handleSaveAnalysis} 
                style={{ 
                  padding: "0.75rem 2.5rem", 
                  backgroundColor: "transparent", 
                  color: techno.text, 
                  border: `2px solid ${techno.border}`, 
                  borderRadius: "6px", 
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Save
              </button>
            </div>

            {/* Detailed Results */}
            <div
              ref={resultRef}
              style={{
                marginTop: "2rem",
                background: techno.panel,
                padding: "1.5rem",
                borderRadius: "10px",
                boxShadow: techno.glow,
                display: "none" // Hidden but available for PDF export
              }}
            >
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

            {/* Final Result */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Estimated Monthly Cost</h3>
              <p style={{ 
                fontSize: "4rem", 
                fontWeight: "bold",
                color: techno.text
              }}>
                ${mode === "Wholesale" ? results.mao : results.mortgagePayment}
              </p>
            </div>

            {/* Export and Save Buttons */}
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              marginTop: "1.5rem", 
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              <button 
                onClick={exportPDF} 
                style={{ 
                  padding: "0.75rem 1.5rem", 
                  borderRadius: "6px", 
                  backgroundColor: techno.buttonBg, 
                  color: "#000", 
                  border: "none", 
                  fontWeight: "bold" 
                }}
              >
                Export PDF
              </button>
              <button 
                onClick={handleSaveAnalysis} 
                style={{ 
                  padding: "0.75rem 1.5rem", 
                  borderRadius: "6px", 
                  backgroundColor: techno.buttonBg, 
                  color: "#000", 
                  border: "none", 
                  fontWeight: "bold" 
                }}
              >
                Save Analysis
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(RentersView);