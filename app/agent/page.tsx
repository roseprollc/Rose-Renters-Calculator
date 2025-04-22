"use client"

import Link from "next/link"
import { Send, ExternalLink } from "lucide-react"
import ProtectedRoute from "@/components/auth/protected-route"
import { useAgentChat, type PropertyData } from "../../hooks/use-agent-chat"
import "./agent.css"

// Mock property data
const propertyData: PropertyData = {
  address: "123 Maple Avenue, Springfield",
  source: "Origin From Realth",
  price: 450000,
  propertyTaxes: 6187,
  estimatedRent: 2500,
}

export default function AgentPage() {
  const {
    messages,
    inputValue = "", // ✅ Ensure inputValue is always a string
    setInputValue,
    isLoading,
    handleSubmit,
    messagesEndRef,
  } = useAgentChat(propertyData)

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-black text-white">
        {/* Header */}
        <header className="border-b border-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="text-[#ff3e3e]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C12 22 20 18 20 11V5L12 2L4 5V11C4 18 12 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">RoseIntel</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link href="/renters" className="text-gray-300 hover:text-[#b4fc7f] transition-colors">
                  Renters
                </Link>
                <Link href="/features" className="text-gray-300 hover:text-[#b4fc7f] transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-gray-300 hover:text-[#b4fc7f] transition-colors">
                  Pricing
                </Link>
                <Link href="/contact" className="text-gray-300 hover:text-[#b4fc7f] transition-colors">
                  Contact
                </Link>
              </nav>
            </div>

            <Link
              href="/dashboard"
              className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors glow-on-hover"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Details Panel */}
            <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-white">Smart Import</h2>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{propertyData.address}</h3>
                    <p className="text-gray-400">{propertyData.source}</p>
                  </div>
                  <button className="text-[#b4fc7f] hover:text-white transition-colors">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 flex items-center gap-1">
                        Imported values{" "}
                        <span className="inline-block ml-1 rounded-full bg-gray-700 text-xs w-4 h-4 flex items-center justify-center">
                          i
                        </span>
                      </p>
                      <p className="text-2xl font-bold">${propertyData.price.toLocaleString()}</p>
                    </div>
                    <button className="bg-black border border-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-900 transition-colors glow-on-hover">
                      Edit
                    </button>
                  </div>
                </div>

                <div className="p-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400">Property taxes per year</p>
                      <p className="text-2xl font-bold">${propertyData.propertyTaxes.toLocaleString()}</p>
                    </div>
                    <button className="bg-black border border-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-900 transition-colors glow-on-hover">
                      Edit
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400">Estimated rent per month</p>
                      <p className="text-2xl font-bold">${propertyData.estimatedRent.toLocaleString()}</p>
                    </div>
                    <button className="bg-black border border-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-900 transition-colors glow-on-hover">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">Chat with AI Agent</h2>
              </div>

              <div className="flex-grow overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message: { id: string; content: string; type: 'user' | 'agent' }) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg max-w-[80%] message-animation ${
                        message.type === "user" ? "bg-gray-800 ml-auto" : "bg-[#1a1a1a] border border-gray-800"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-lg max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-[#b4fc7f] typing-indicator"></div>
                        <div className="w-2 h-2 rounded-full bg-[#b4fc7f] typing-indicator" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#b4fc7f] typing-indicator" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4 border-t border-gray-800">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow bg-black border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b4fc7f] text-white glow-input"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-[#b4fc7f] text-black p-2 rounded-lg hover:bg-[#a3eb6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed glow-on-hover"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 p-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <Link href="/terms" className="text-gray-400 hover:text-[#b4fc7f] transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-[#b4fc7f] transition-colors">
                  Privacy
                </Link>
                <span className="text-gray-600">©2024 RoseIntel</span>
              </div>
              <div>
                <a href="mailto:support@roseintel.com" className="text-gray-400 hover:text-[#b4fc7f] transition-colors">
                  support@roseintel.com
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
