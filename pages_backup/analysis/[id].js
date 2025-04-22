// pages/analysis/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PublicAnalysisView() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/analysis/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error loading analysis:", err));
  }, [id]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDark(mediaQuery.matches);
    const handler = (e) => setPrefersDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!data)
    return <p style={{ padding: "2rem", textAlign: "center" }}>Loading analysis...</p>;

  const panelStyle = {
    maxWidth: "700px",
    margin: "2rem auto",
    padding: "2rem",
    background: prefersDark ? "#1e1e1e" : "#f9f9f9",
    color: prefersDark ? "#fff" : "#111",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <div style={panelStyle}>
      <h1>📊 Shared Analysis View</h1>

      {data?.tags && (
        <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
          🏷️ Notes: {data.tags}
        </p>
      )}

      <div style={{ marginTop: "1rem", lineHeight: "1.8" }}>
        <p><strong>Purchase Price:</strong> ${data.purchasePrice}</p>
        <p><strong>Monthly Mortgage:</strong> ${data.results?.mortgagePayment}</p>
        <p><strong>Total Monthly Expenses:</strong> ${data.results?.totalExpenses}</p>
        <p><strong>Monthly Cash Flow:</strong> ${data.results?.monthlyCashFlow}</p>
        <p><strong>Annual Cash Flow:</strong> ${data.results?.annualCashFlow}</p>
        <p><strong>Cash-on-Cash ROI:</strong> {data.results?.roi}%</p>
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: prefersDark ? "#ccc" : "#555" }}>
        Shared by: <strong>{data.email || "Anonymous"}</strong>
      </p>
    </div>
  );
}
