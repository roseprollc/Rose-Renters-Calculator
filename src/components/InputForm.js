import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

const InputForm = ({ form, handleChange, inputFields }) => {
  const { theme } = useContext(ThemeContext);
  const [smartPreview, setSmartPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processImport = () => {
      const saved = localStorage.getItem("smartImportPreview");
      const prefill = localStorage.getItem("prefillForm");
      
      if (!saved && !prefill) {
        setIsLoading(false);
        return;
      }

      try {
        // Process preview data
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log("Imported property data:", parsed);
          setSmartPreview(parsed);
        }

        // Process prefill data
        if (prefill) {
          const prefillData = JSON.parse(prefill);
          Object.entries(prefillData).forEach(([field, value]) => {
            handleChange({
              target: {
                name: field,
                value: typeof value === 'string' ? parseFloat(value) || 0 : value,
                type: 'number'
              }
            });
          });
        }
      } catch (error) {
        console.error("Processing error:", error);
      } finally {
        setIsLoading(false);
        localStorage.removeItem("smartImportPreview");
        localStorage.removeItem("prefillForm");
      }
    };

    processImport();
  }, [handleChange]);

  const cleanNumber = (value) => {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'number') return value;
    return parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;
  };

  const getMinValue = (name) => {
    const nonNegativeFields = [
      "hoaFees", "pmi", "repairs", 
      "insurance", "propertyTax", "managementFee"
    ];
    return nonNegativeFields.includes(name) ? 0 : undefined;
  };

  const previewBoxStyle = {
    backgroundColor: theme === "dark" ? "#2d2d2d" : "#f5f5f5",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "2rem",
    color: "#ffffff",
    border: theme === "dark" ? "1px solid #444" : "1px solid #ddd"
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading property data...</div>;
  }

  return (
    <div>
      {smartPreview && (
        <div style={previewBoxStyle}>
          <h3 style={{ marginTop: 0 }}>🏡 Smart Import Preview</h3>
          <p><strong>Address:</strong> {smartPreview.address || "N/A"}</p>
          <p><strong>Price:</strong> {smartPreview.listPrice || "N/A"}</p>
          <p><strong>Rent:</strong> {smartPreview.estRent || "N/A"}</p>
          {smartPreview.zipStats && (
            <>
              <p><strong>Vacancy:</strong> {smartPreview.zipStats.vacancy || "N/A"}</p>
              <p><strong>Taxes:</strong> {smartPreview.zipStats.taxes || "N/A"}</p>
              <p><strong>Repairs:</strong> {smartPreview.zipStats.repairs || "N/A"}</p>
            </>
          )}
          {smartPreview.comps && (
            <>
              <hr style={{ margin: "1rem 0", borderColor: "#555" }} />
              <p><strong>Avg Rent:</strong> {smartPreview.comps.avgRent || "N/A"}</p>
              <p><strong>Rent Range:</strong> {smartPreview.comps.range || "N/A"}</p>
            </>
          )}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.25rem"
      }}>
        {inputFields.map((field) => (
          <div key={field.name}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: "#000"
            }}>
              {field.label}
            </label>
            {field.name === "notes" ? (
              <textarea
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "#000",
                  backgroundColor: theme === "dark" ? "#333" : "#fff"
                }}
                rows={3}
              />
            ) : (
              <input
                type="number"
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                min={getMinValue(field.name)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "#000",
                  backgroundColor: theme === "dark" ? "#333" : "#fff"
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputForm;