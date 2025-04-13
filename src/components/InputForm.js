import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

const InputForm = ({ form, handleChange, inputFields }) => {
  const { theme } = useContext(ThemeContext);
  const [smartPreview, setSmartPreview] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("smartImportPreview");
    if (saved) {
      setSmartPreview(JSON.parse(saved));
    }
  }, []);

  const getMinValue = (name) => {
    const nonNegativeFields = [
      "hoaFees",
      "pmi",
      "repairs",
      "insurance",
      "propertyTax",
      "managementFee",
    ];
    return nonNegativeFields.includes(name) ? 0 : undefined;
  };

  const previewBoxStyle = {
    backgroundColor: theme === "dark" ? "#1e1e1e" : "#f3f4f6",
    padding: "1rem",
    borderRadius: "10px",
    border: theme === "dark" ? "1px solid #333" : "1px solid #ccc",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  };

  return (
    <>
      {smartPreview && (
        <div style={previewBoxStyle}>
          <h3 style={{ marginTop: 0 }}>🏡 Smart Import Preview</h3>
          <p><strong>Address:</strong> {smartPreview.address}</p>
          <p><strong>List Price:</strong> {smartPreview.listPrice}</p>
          <p><strong>Est. Rent:</strong> {smartPreview.estRent}</p>
          <p><strong>ZIP Vacancy:</strong> {smartPreview.zipStats?.vacancy}</p>
          <p><strong>Taxes:</strong> {smartPreview.zipStats?.taxes}</p>
          <p><strong>Repairs:</strong> {smartPreview.zipStats?.repairs}</p>
          <hr style={{ margin: "1rem 0", borderColor: theme === "dark" ? "#444" : "#ccc" }} />
          <p><strong>Avg Rent:</strong> {smartPreview.comps?.avgRent}</p>
          <p><strong>Rent Range:</strong> {smartPreview.comps?.range}</p>
          <p><strong>Occupancy:</strong> {smartPreview.comps?.occupancy}</p>
          <p><strong>Rent/Sqft:</strong> {smartPreview.comps?.rentPerSqft}</p>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.25rem"
      }}>
        {inputFields.map((field) => (
          <div key={field.name} style={{ width: "100%" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              {field.label}
            </label>

            {field.name === "notes" ? (
              <textarea
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                rows={3}
                placeholder="Optional notes or tags..."
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  background: theme === "dark" ? "#222" : "#fff",
                  color: theme === "dark" ? "#fff" : "#000",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <input
                type="number"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                inputMode="decimal"
                min={getMinValue(field.name)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  background: theme === "dark" ? "#222" : "#fff",
                  color: theme === "dark" ? "#fff" : "#000",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default InputForm;