import React, { useEffect, useState } from "react";

const GPTInsights = ({ results, mode }) => {
  const [insight, setInsight] = useState("");

  useEffect(() => {
    if (!results || mode === "Wholesale") {
      setInsight("");
      return;
    }

    const { roi, capRate, monthlyCashFlow } = results;

    // Simple mock insight logic
    const roiNum = parseFloat(roi);
    const capRateNum = parseFloat(capRate);
    const cashflowNum = parseFloat(monthlyCashFlow);

    let feedback = "";

    if (roiNum > 12 && capRateNum > 7) {
      feedback = "🔥 Strong investment! High ROI and healthy cap rate suggest strong returns.";
    } else if (roiNum < 6 || cashflowNum < 0) {
      feedback = "⚠️ Caution: This deal may produce low returns or even negative cash flow.";
    } else {
      feedback = "🧠 Solid opportunity. You may want to explore rent increases or negotiate price.";
    }

    setInsight(feedback);
  }, [results, mode]);

  if (!insight) return null;

  return (
    <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#fef3c7", borderRadius: "8px" }}>
      <h4 style={{ marginBottom: "0.5rem" }}>🤖 GPT-Powered Insight (Mock)</h4>
      <p style={{ margin: 0 }}>{insight}</p>
    </div>
  );
};

export default GPTInsights;
