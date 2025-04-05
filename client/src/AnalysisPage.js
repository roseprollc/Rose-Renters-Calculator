import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AnalysisPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error loading analysis:", err));
  }, [id]);

  if (!data) return <p>Loading analysis...</p>;

  const { results } = data;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
      <h1>Saved Analysis</h1>
      <p><strong>Purchase Price:</strong> ${data.purchasePrice}</p>
      <p><strong>Monthly Mortgage:</strong> ${results.mortgagePayment}</p>
      <p><strong>Total Monthly Expenses:</strong> ${results.totalExpenses}</p>
      <p><strong>Monthly Cash Flow:</strong> ${results.monthlyCashFlow}</p>
      <p><strong>Annual Cash Flow:</strong> ${results.annualCashFlow}</p>
      <p><strong>Cash-on-Cash ROI:</strong> {results.roi}%</p>
    </div>
  );
}

export default AnalysisPage;
