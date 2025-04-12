import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ResultsChart from "./ResultsChart";

const ResultsDisplay = ({ results }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={{
        marginTop: "2rem",
        background: theme === "dark" ? "#1e1e1e" : "#f9f9f9",
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <h2>Results:</h2>
      <p>
        <strong>Monthly Mortgage:</strong> ${results.mortgagePayment}
      </p>
      <p>
        <strong>Total Monthly Expenses:</strong> ${results.totalExpenses}
      </p>
      <p>
        <strong>Monthly Cash Flow:</strong> ${results.monthlyCashFlow}
      </p>
      <p>
        <strong>Annual Cash Flow:</strong> ${results.annualCashFlow}
      </p>
      <p>
        <strong>Cash-on-Cash ROI:</strong> {results.roi}%
      </p>
      <ResultsChart results={results} />
    </div>
  );
};

export default ResultsDisplay;
