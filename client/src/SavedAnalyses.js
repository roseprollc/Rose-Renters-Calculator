import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SavedAnalyses() {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    fetch("https://rose-renters-backend.onrender.com/api/analysis/all")
      .then((res) => res.json())
      .then((data) => setAnalyses(data))
      .catch((err) => console.error("Failed to load analyses", err));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "2rem" }}>
      <h1>Saved Analyses</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Date</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Monthly Cash Flow</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Annual Cash Flow</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>ROI</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Link</th>
          </tr>
        </thead>
        <tbody>
          {analyses.map((analysis) => (
            <tr key={analysis._id}>
              <td style={{ padding: "0.5rem" }}>
                {new Date(analysis.createdAt).toLocaleDateString()}
              </td>
              <td style={{ padding: "0.5rem" }}>${analysis.results?.monthlyCashFlow}</td>
              <td style={{ padding: "0.5rem" }}>${analysis.results?.annualCashFlow}</td>
              <td style={{ padding: "0.5rem" }}>{analysis.results?.roi}%</td>
              <td style={{ padding: "0.5rem" }}>
                <Link to={`/analysis/${analysis._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SavedAnalyses;
