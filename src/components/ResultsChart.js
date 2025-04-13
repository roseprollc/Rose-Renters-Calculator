// client/src/components/ResultsChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ResultsChart({ results }) {
  const data = {
    labels: [
      "Mortgage",
      "Expenses",
      "Cash Flow",
      "Annual Cash Flow",
      "ROI %"
    ],
    datasets: [
      {
        label: "Financial Breakdown",
        data: [
          results.mortgagePayment,
          results.totalExpenses,
          results.monthlyCashFlow,
          results.annualCashFlow,
          results.roi,
        ],
        backgroundColor: [
          "#6c5ce7",
          "#00cec9",
          "#fdcb6e",
          "#e17055",
          "#0984e3",
        ],
      },
    ],
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Visual Breakdown</h3>
      <Bar data={data} />
    </div>
  );
}

export default ResultsChart;
