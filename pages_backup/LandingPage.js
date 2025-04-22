import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { ThemeContext } from "../src/context/ThemeContext";

const LandingPage = () => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSmartImport = async () => {
    if (!url) {
      setError("Please enter a Redfin URL");
      return;
    }

    if (!url.includes('redfin.com')) {
      setError("Currently only Redfin URLs are supported");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/smart-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const propertyData = await response.json();

      // Save to localStorage for the renters page
      localStorage.setItem("smartImportPreview", JSON.stringify(propertyData));

      // Prefill basic form fields
      localStorage.setItem("prefillForm", JSON.stringify({
        purchasePrice: propertyData.listPrice || "",
        monthlyRent: propertyData.estRent || "",
        vacancyRate: propertyData.zipStats?.vacancy || "",
        propertyTax: propertyData.zipStats?.taxes || "",
        repairs: propertyData.zipStats?.repairs || "",
      }));

      router.push("/renters");
    } catch (err) {
      console.error("Import failed:", err);
      setError(err.message || "Failed to import property data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    router.push("/renters");
  };

  return (
    <div className={`${isDark ? "bg-technoDark text-white" : "bg-white text-black"} min-h-screen font-techno`}>
      {/* Hero Section */}
      <section className="py-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          AI-driven real estate cost analysis
        </h1>
        
        <ul className={`max-w-md mb-8 text-lg ${isDark ? "text-gray-400" : "text-gray-600"} space-y-2`}>
          <li className="flex items-center justify-center">
            <span className="mr-2">•</span> Generate in-depth cost reports
          </li>
          <li className="flex items-center justify-center">
            <span className="mr-2">•</span> Compare with market trends
          </li>
          <li className="flex items-center justify-center">
            <span className="mr-2">•</span> Optimize investment decisions
          </li>
        </ul>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={handleGetStarted}
            className={`${isDark ? "bg-technoGreen text-black" : "bg-green-600 text-white"} font-bold px-8 py-3 rounded hover:brightness-110`}
          >
            GET STARTED
          </button>
          <button
            onClick={handleSmartImport}
            disabled={isLoading}
            className={`${isDark ? "border-technoGreen text-technoGreen hover:bg-technoGreen hover:text-black" : "border-green-600 text-green-600 hover:bg-green-50"} bg-transparent border-2 font-bold px-8 py-3 rounded transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'PROCESSING...' : 'SMART IMPORT'}
          </button>
        </div>

        {/* Smart Property Lookup */}
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Smart Property Lookup</h2>
          <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Enter a Redfin property URL to automatically import all data
          </p>
          <input
            type="text"
            placeholder="Paste Redfin URL (e.g. https://www.redfin.com/...)"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            className={`w-full px-4 py-3 rounded border ${isDark ? "bg-technoPanel text-white border-technoGreen" : "bg-white text-black border-gray-300"}`}
          />
          {error && (
            <p className={`mt-2 text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
              {error}
            </p>
          )}
        </div>
      </section>

      {/* Rest of your sections remain unchanged */}
      <section className={`py-16 px-6 ${isDark ? "bg-technoPanel" : "bg-gray-50"}`}>
        {/* ... existing how-to-use section ... */}
      </section>

      <section className={`py-16 px-6 ${isDark ? "bg-technoDark" : "bg-white"}`}>
        {/* ... existing trusted-by section ... */}
      </section>

      <section className={`py-16 px-6 ${isDark ? "bg-technoPanel" : "bg-gray-50"}`}>
        {/* ... existing what-is-for section ... */}
      </section>

      <footer className={`py-8 text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        © {new Date().getFullYear()} Roselntel. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;