import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const LandingPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [url, setUrl] = useState("");
  const [mockResult, setMockResult] = useState(null);

  const handleSmartImport = () => {
    if (!url) return;

    const zillowPattern = /zillow\.com\/homedetails\/([^\/]+)/i;
    const redfinPattern = /redfin\.com\/(?:[^\/]+\/)+home\/(\d+)/i;
    const realtorPattern = /realtor\.com\/realestateandhomes-detail\/([^\/]+)/i;

    let matchedSource = "mock";
    let parsedData = {
      address: "123 Elm St, Miami, FL 33101",
      listPrice: "$520,000",
      estRent: "$3,200/month",
      zipStats: {
        vacancy: "6%",
        taxes: "$520/mo",
        repairs: "$150/mo",
      },
      comps: {
        avgRent: "$3,180",
        range: "$2,900 – $3,500",
        occupancy: "92%",
        rentPerSqft: "$2.25/sqft",
      },
    };

    if (zillowPattern.test(url)) matchedSource = "zillow";
    else if (redfinPattern.test(url)) matchedSource = "redfin";
    else if (realtorPattern.test(url)) matchedSource = "realtor";

    console.log("Smart Import Source:", matchedSource);

    localStorage.setItem(
      "prefillForm",
      JSON.stringify({
        purchasePrice: "520000",
        monthlyRent: "3200",
        vacancyRate: "6",
        propertyTax: "520",
        repairs: "150",
      })
    );

    localStorage.setItem("smartImportPreview", JSON.stringify(parsedData));
    setMockResult(parsedData);
  };

  const baseStyle = {
    backgroundColor: isDark ? "#121212" : "#fff",
    color: isDark ? "#fff" : "#111",
  };

  const sectionLight = isDark ? "#1e1e1e" : "#f7f9fc";
  const sectionWhite = isDark ? "#121212" : "#ffffff";

  return (
    <div style={baseStyle}>
      {/* Section 1 - Hero */}
      <div
        style={{
          padding: "4rem 2rem",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>
          Welcome to <span role="img" aria-label="rose">🌹</span>{" "}
          <span style={{ color: "#6c63ff" }}>RoseIntel</span>
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: isDark ? "#bbb" : "#555" }}>
          Analyze rental deals, generate reports, and save your results.
        </p>

        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <Link to="/login"><button style={btnStyle}>Login</button></Link>
          <Link to="/signup"><button style={btnStyle}>Sign Up</button></Link>
          <Link to="/renters"><button style={btnStyle}>Enter App</button></Link>
        </div>

        {/* Smart Import Input */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Paste Zillow, Redfin, or Realtor URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "300px",
              padding: "0.75rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              backgroundColor: isDark ? "#1e1e1e" : "#fff",
              color: isDark ? "#fff" : "#000",
            }}
          />
          <button onClick={handleSmartImport} style={btnStyle}>
            Try Smart Import
          </button>
        </div>

        {/* Smart Import Result */}
        {mockResult && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              maxWidth: "600px",
              backgroundColor: isDark ? "#1e1e1e" : "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.03)",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Mock Property Preview</h3>
            <p><strong>🏠 Address:</strong> {mockResult.address}</p>
            <p><strong>💰 List Price:</strong> {mockResult.listPrice}</p>
            <p><strong>💸 Est. Rent:</strong> {mockResult.estRent}</p>
            <p><strong>🏘️ ZIP Vacancy:</strong> {mockResult.zipStats.vacancy}</p>
            <p><strong>🏘️ Taxes:</strong> {mockResult.zipStats.taxes}</p>
            <p><strong>🚰 Repairs:</strong> {mockResult.zipStats.repairs}</p>

            <hr style={{ margin: "1rem 0", borderColor: isDark ? "#333" : "#ddd" }} />
            <h4>📍 ZIP-Level Rent Comps</h4>
            <p><strong>Average Rent:</strong> {mockResult.comps.avgRent}</p>
            <p><strong>Rent Range:</strong> {mockResult.comps.range}</p>
            <p><strong>Occupancy Rate:</strong> {mockResult.comps.occupancy}</p>
            <p><strong>Rent per Sqft:</strong> {mockResult.comps.rentPerSqft}</p>
          </div>
        )}
      </div>

      {/* Section 2 - Audience */}
      <section style={{ padding: "4rem 2rem", backgroundColor: sectionLight }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}>
          Who is RoseIntel For?
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "900px", margin: "0 auto" }}>
          <Audience icon="🏠" title="Long-Term Rental Investors" description="Quickly assess traditional rental properties, calculate returns, and plan your financing strategy with clarity." />
          <Audience icon="🛎️" title="Airbnb & Short-Term Hosts" description="Analyze nightly rates, cleaning fees, and occupancy to understand profitability before listing." />
          <Audience icon="🤝" title="Wholesalers & Deal Finders" description="Evaluate off-market deals fast, generate pro-level reports, and share with buyers or partners." />
        </div>
      </section>

      {/* Section 3 - Features */}
      <section style={{ padding: "4rem 2rem", backgroundColor: sectionWhite }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1.5rem" }}>
          Why Choose RoseIntel?
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "900px", margin: "0 auto" }}>
          <Feature icon="⚡" title="Instant Deal Analysis" description="Plug in your numbers and get real-time ROI, cash flow, and mortgage breakdowns in seconds." />
          <Feature icon="📄" title="Generate Clean PDF Reports" description="Export beautiful, data-rich reports you can share with investors, lenders, or buyers." />
          <Feature icon="🔐" title="Securely Save & Share" description="Log in to save analyses, track changes, and share private deal links with ease." />
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, description }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
    <span style={{ fontSize: "2rem" }}>{icon}</span>
    <div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ marginTop: "0.25rem" }}>{description}</p>
    </div>
  </div>
);

const Audience = ({ icon, title, description }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
    <span style={{ fontSize: "2rem" }}>{icon}</span>
    <div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ marginTop: "0.25rem" }}>{description}</p>
    </div>
  </div>
);

const btnStyle = {
  padding: "0.75rem 1.75rem",
  fontSize: "1rem",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#3b82f6",
  color: "#fff",
  cursor: "pointer",
  transition: "background-color 0.2s ease-in-out",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

export default LandingPage;
