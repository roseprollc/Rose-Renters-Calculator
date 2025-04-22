"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ImportPage() {
  const [propertyUrl, setPropertyUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check for URL in localStorage when component mounts
    const savedUrl = localStorage.getItem("smartImportURL")
    if (savedUrl) {
      setPropertyUrl(savedUrl)
      // Clear the URL from localStorage to avoid reusing it
      localStorage.removeItem("smartImportURL")
      // Optionally auto-trigger the import
      // handleImport()
    }
  }, [])

  const handleImport = async () => {
    if (!propertyUrl) {
      setError("Please enter a property URL")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/smart-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: propertyUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to import property data")
      }

      const data = await response.json()
      
      // Save the parsed data to localStorage for the calculator
      localStorage.setItem("calculatorData", JSON.stringify(data))
      
      // Navigate to the calculator
      router.push("/calculator")
    } catch (err) {
      console.error("Import error:", err)
      setError("Failed to import property data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-[#2ecc71]">
            Smart Import
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Auto-fill your calculator by pasting a property link.
          </p>

          <div className="bg-neutral-900 p-8 rounded-lg shadow-[0_0_15px_rgba(46,204,113,0.1)]">
            <div className="space-y-6">
              <div>
                <label htmlFor="propertyUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  Property URL
                </label>
                <input
                  type="url"
                  id="propertyUrl"
                  value={propertyUrl}
                  onChange={(e) => setPropertyUrl(e.target.value)}
                  placeholder="Paste Redfin, Zillow, or Realtor.com URL"
                  className="w-full px-4 py-3 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] placeholder-gray-500"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={isLoading}
                className="w-full py-3 px-6 bg-[#2ecc71] hover:bg-[#27ae60] text-black rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Importing Property...
                  </div>
                ) : (
                  "Import to Calculator"
                )}
              </button>

              <p className="text-sm text-gray-300 mt-4">
                Supported platforms: Redfin, Zillow, Realtor.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 