import React, { useEffect, useState } from "react";

const SavedAnalyses = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://rose-renters-backend.onrender.com/api/analysis/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); // ✅ Debug log
        setAnalyses(data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch analyses", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: "2rem" }}>
      <h1>Saved Analyses</h1>
      {analyses.length === 0 ? (
        <p>No saved analyses yet.</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {analyses.map((item) => (
            <li
              key={item._id}
              style={{
                listStyle: "none",
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <p><strong>Rent:</strong> ${item.monthlyRent}</p>
              <p><strong>Cash Flow:</strong> ${item.results?.monthlyCashFlow}</p>
              <p><strong>ROI:</strong> {item.results?.roi}%</p>
              <a href={`/analysis/${item._id}`} style={{ color: "blue" }}>
                View Full Analysis
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedAnalyses;
