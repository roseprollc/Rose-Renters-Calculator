import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AnalysisPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [prefersDark, setPrefersDark] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    fetch(`https://rose-renters-backend.onrender.com/api/analysis/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error loading analysis:", err));
  }, [id]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e) => setPrefersDark(e.matches);
    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  const handleEdit = () => {
    if (data && data.results) {
      localStorage.setItem("prefillForm", JSON.stringify(data));
      localStorage.setItem("prefillResults", JSON.stringify(data.results));
      navigate("/");
    }
  };

  if (!data)
    return <p style={{ textAlign: "center", padding: "2rem" }}>Loading analysis...</p>;
  if (!data.results)
    return <p style={{ textAlign: "center", padding: "2rem" }}>No results found for this analysis.</p>;

  const containerStyle = {
    maxWidth: "700px",
    margin: "auto",
    padding: "2rem",
    borderRadius: "10px",
    background: prefersDark ? "#1e1e1e" : "#ffffff",
    color: prefersDark ? "#f0f0f0" : "#111",
    boxShadow: prefersDark
      ? "0 0 15px rgba(255,255,255,0.05)"
      : "0 0 10px rgba(0,0,0,0.05)",
  };

  const socialIcons = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
      icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/",
      icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/",
      icon: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
    },
    {
      name: "X (Twitter)",
      url: `https://x.com/intent/tweet?url=${window.location.href}`,
      icon: "https://cdn-icons-png.flaticon.com/512/3670/3670151.png",
    },
  ];

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: "1rem" }}>📊 Public Analysis View</h1>

      {data?.tags && (
        <p style={{ fontStyle: "italic", marginBottom: "1rem", color: prefersDark ? "#ccc" : "#555" }}>
          🏷️ Notes/Tags: {data.tags}
        </p>
      )}

      <div style={{ lineHeight: "1.8" }}>
        <p><strong>Purchase Price:</strong> ${data.purchasePrice}</p>
        <p><strong>Monthly Mortgage:</strong> ${data.results.mortgagePayment}</p>
        <p><strong>Total Monthly Expenses:</strong> ${data.results.totalExpenses}</p>
        <p><strong>Monthly Cash Flow:</strong> ${data.results.monthlyCashFlow}</p>
        <p><strong>Annual Cash Flow:</strong> ${data.results.annualCashFlow}</p>
        <p><strong>Cash-on-Cash ROI:</strong> {data.results.roi}%</p>
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: prefersDark ? "#aaa" : "#777" }}>
        Shared by: <strong>{data.email || "anonymous"}</strong>
      </p>

      <div style={{ marginTop: "1.5rem" }}>
        <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
          🔗 Share this analysis:
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          {socialIcons.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              title={platform.name}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                overflow: "hidden",
                display: "inline-block",
              }}
            >
              <img
                src={platform.icon}
                alt={platform.name}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </a>
          ))}
        </div>
      </div>

      <button
        onClick={handleEdit}
        style={{
          marginTop: "2rem",
          backgroundColor: "#3b82f6",
          color: "#fff",
          padding: "0.6rem 1.2rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        ✏️ Edit This Analysis
      </button>
    </div>
  );
}

export default AnalysisPage;
