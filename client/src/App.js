import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AnalysisPage from "./AnalysisPage";

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
    const loanAmt = pp - (pp * dpPercent);
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
          <div style={{ maxWidth: 700, margin: "auto", padding: "2rem" }}>
            <div
              style={{
                background: "#ffffff",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.8rem" }}>
                Rose Renters Calc
              </h1>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                {inputFields.map((field) => (
                  <div key={field.name}>
                    <label>{field.label}</label>
                    <input
                      type="number"
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "0.75rem" }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={calculate}
                style={{
                  padding: "0.75rem",
                  marginTop: "2rem",
                  width: "100%",
                  fontSize: "1rem",
                }}
              >
                Calculate
              </button>

              {results && (
                <>
                  <div
                    style={{
                      marginTop: "2rem",
                      background: "#ffffff",
                      padding: "1.5rem",
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "1.4rem",
                        marginBottom: "1rem",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "0.5rem",
                      }}
                    >
                      📊 Results
                    </h2>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        rowGap: "1rem",
                        columnGap: "1rem",
                      }}
                    >
                      <div>
                        <strong>Monthly Mortgage:</strong>
                        <br />
                        ${results.mortgagePayment}
                      </div>
                      <div>
                        <strong>Total Monthly Expenses:</strong>
                        <br />
                        ${results.totalExpenses}
                      </div>
                      <div>
                        <strong>Monthly Cash Flow:</strong>
                        <br />
                        ${results.monthlyCashFlow}
                      </div>
                      <div>
                        <strong>Annual Cash Flow:</strong>
                        <br />
                        ${results.annualCashFlow}
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <strong>Cash-on-Cash ROI:</strong>
                        <br />
                        <span style={{ fontSize: "1.25rem", color: "#10b981" }}>{results.roi}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    style={{ marginTop: "1rem", padding: "0.5rem 1rem", width: "100%" }}
                    onClick={async () => {
                      const response = await fetch("http://localhost:4000/api/save", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...form, results }),
                      });

                      const data = await response.json();
                      const shareableLink = `${window.location.origin}/analysis/${data.id}`;
                      alert("Saved! Shareable link:\n" + shareableLink);
                    }}
                  >
                    Save Analysis
                  </button>
                </>
              )}
            </div>
          </div>
        }
      />
      <Route path="/analysis/:id" element={<AnalysisPage />} />
    </Routes>
  );
}

export default App;
