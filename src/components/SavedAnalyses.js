import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SavedAnalyses() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await fetch("https://rose-renters-backend.onrender.com/api/analysis/all");
        if (!res.ok) throw new Error("Server error while fetching saved analyses.");

        const data = await res.json();

        // Sort by most recent first (optional)
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setAnalyses(sorted);
      } catch (err) {
        console.error("Failed to fetch analyses:", err);
        toast.error("⚠️ Failed to load saved analyses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>📁 Saved Analyses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : analyses.length === 0 ? (
        <p>No saved analyses found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {analyses.map((analysis) => (
            <div
              key={analysis._id}
              style={{
                border: "1px solid #ddd",
                padding: "1.25rem",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>🗓️ Saved:</strong>{" "}
                {analysis.createdAt
                  ? new Date(analysis.createdAt).toLocaleString()
                  : "Unknown"}
              </p>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>📝 Notes:</strong>{" "}
                {analysis.tags?.trim()
                  ? analysis.tags
                  : <em>None provided</em>}
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem" }}>
                <Link to={`/analysis/${analysis._id}`}>
                  <button style={btnStyle}>View</button>
                </Link>
                <button
                  onClick={() => toast.info("🧼 Delete functionality coming soon")}
                  style={{ ...btnStyle, backgroundColor: "#ef4444" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "0.5rem 1.25rem",
  fontSize: "0.95rem",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#3b82f6",
  color: "#fff",
  cursor: "pointer",
  transition: "0.2s ease",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

export default SavedAnalyses;
