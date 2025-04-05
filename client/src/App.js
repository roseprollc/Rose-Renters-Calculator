import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AnalysisPage from "./AnalysisPage";
import SavedAnalyses from "./SavedAnalyses"; // ✅ Included route page

function App() {
  const [form, setForm] = useState({
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
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const {
      purchasePrice,
      downPayment,
      loanTerm,
      interestRate,
      monthlyRent,
      vacancyRate,
      propertyTax,
      insurance,
      repairs,
      managementFee,
      hoaFees,
    } = form;

    const pp = parseFloat(purchasePrice || 0);
    const dpPercent = parseFloat(downPayment || 0) / 100;
    const loanAmt = pp - pp * dpPercent;
    const monthlyInterest = (parseFloat(interestRate || 0) / 100) / 12;
    const numberOfPayments = parseFloat(loanTerm || 0) * 12;

    const mortgagePayment =
      loanAmt *
      (monthlyInterest /
        (1 - Math.pow(1 + monthlyInterest, -numberOfPayments)));

    const rent = parseFloat(monthlyRent || 0);
    const vacancyLoss = rent * (parseFloat(vacancyRate || 0) / 100);
    const effectiveRent = rent - vacancyLoss;

    const totalExpenses =
      parseFloat(mortgagePayment || 0) +
      parseFloat(propertyTax || 0) +
      parseFloat(insurance || 0) +
      parseFloat(repairs || 0) +
      parseFloat(managementFee || 0) +
      parseFloat(hoaFees || 0);

    const monthlyCashFlow = effectiveRent - totalExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashInvested = pp * dpPercent;

    const roi = (annualCashFlow / cashInvested) * 100;

    setResults({
      mortgagePayment: mortgagePayment.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      monthlyCashFlow: monthlyCashFlow.toFixed(2),
      annualCashFlow: annualCashFlow.toFixed(2),
      roi: roi.toFixed(2),
    });
  };

  const inputFields = [
    { label: "Purchase Price", name: "purchasePrice" },
    { label: "Down Payment (%)", name: "downPayment" },
    { label: "Loan Term (years)", name: "loanTerm" },
    { label: "Interest Rate (%)", name: "interestRate" },
    { label: "Monthly Rent", name: "monthlyRent" },
    { label: "Vacancy Rate (%)", name: "vacancyRate" },
    { label: "Monthly Property Tax", name: "propertyTax" },
    { label: "Monthly Insurance", name: "insurance" },
    { label: "Monthly Repairs", name: "repairs" },
    { label: "Monthly Management Fee", name: "managementFee" },
    { label: "Monthly HOA Fees", name: "hoaFees" },
  ];

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
            <h1>Rose Renters Calc</h1>
            {inputFields.map((field) => (
              <div key={field.name}>
                <label>{field.label}</label>
                <input
                  type="number"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                />
              </div>
            ))}
            <button
              onClick={calculate}
              style={{ padding: "0.75rem", marginTop: "1rem" }}
            >
              Calculate
            </button>

            {results && (
              <>
                <div
                  style={{
                    marginTop: "2rem",
                    background: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <h2>Results:</h2>
                  <p><strong>Monthly Mortgage:</strong> ${results.mortgagePayment}</p>
                  <p><strong>Total Monthly Expenses:</strong> ${results.totalExpenses}</p>
                  <p><strong>Monthly Cash Flow:</strong> ${results.monthlyCashFlow}</p>
                  <p><strong>Annual Cash Flow:</strong> ${results.annualCashFlow}</p>
                  <p><strong>Cash-on-Cash ROI:</strong> {results.roi}%</p>
                </div>

                <button
                  style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
                  onClick={async () => {
                    try {
                      const response = await fetch("https://rose-renters-backend.onrender.com/api/analysis/save", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...form, results }),
                      });

                      const data = await response.json();
                      const shareableLink = `${window.location.origin}/analysis/${data.id}`;
                      alert("Saved! Shareable link:\n" + shareableLink);
                    } catch (err) {
                      alert("Error saving analysis. Please try again.");
                    }
                  }}
                >
                  Save Analysis
                </button>
              </>
            )}
          </div>
        }
      />
      <Route path="/analysis/:id" element={<AnalysisPage />} />
      <Route path="/saved" element={<SavedAnalyses />} /> {/* ✅ Added route */}
    </Routes>
  );
}

export default App;
