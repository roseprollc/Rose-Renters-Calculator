import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ExportPDF = () => {
  const handleExport = async () => {
    const resultsSection = document.getElementById("results-section");
    if (!resultsSection) return;

    const canvas = await html2canvas(resultsSection, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("rose-renters-analysis.pdf");
  };

  return (
    <button
      onClick={handleExport}
      style={{
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        background: "#6c63ff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Export as PDF
    </button>
  );
};

export default ExportPDF;
