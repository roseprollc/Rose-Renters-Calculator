// app/features/page.tsx
"use client"

import Link from 'next/link'
import { ArrowLeft, Upload, Calculator, Brain, FileText, BarChart3, Rocket, Lock, Settings } from 'lucide-react'
import { useState } from 'react'
import PageLayout from "../components/PageLayout"

export default function FeaturesPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  
  const features = [
    {
      icon: <Upload className="w-12 h-12" />,
      title: "Smart Import",
      description: "Auto-fill calculator with property data from Zillow, Redfin, and other listing sites."
    },
    {
      icon: <Calculator className="w-12 h-12" />,
      title: "Multi-Mode Calculator",
      description: "Switch between Rent, Airbnb, and Wholesale modes for specialized investment analysis."
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI-Powered Insights",
      description: "Get GPT-based recommendations and analysis for optimizing your investment strategy."
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: "PDF Export & Dashboard",
      description: "Save, organize, and download professional deal reports for your portfolio."
    }
  ]

  return (
    <PageLayout>
      <div className="min-h-screen bg-black">
        <div className="flex flex-col items-center px-4 py-24">
          {/* Hero Section */}
          <div className="text-center mb-20 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#2ecc71] [text-shadow:_0_0_30px_rgba(46,204,113,0.3)]">
              Powerful Features
            </h1>
            <p className="text-xl text-gray-400">
              Unlock the full potential with our advanced real estate investment tools.
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-8 flex flex-col items-center text-center transition-all duration-300"
                style={{
                  boxShadow: hoveredCard === index ? '0 0 30px rgba(46, 204, 113, 0.2)' : 'none',
                  transform: hoveredCard === index ? 'translateY(-5px)' : 'none'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`text-[#2ecc71] mb-6 transition-all duration-300 ${hoveredCard === index ? '[filter:_drop-shadow(0_0_12px_rgba(46,204,113,0.5))]' : ''}`}>
                  {feature.icon}
                </div>
                <h2 className="text-2xl font-bold mb-4 text-[#2ecc71]">
                  {feature.title}
                </h2>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Additional Features Section */}
          <div className="mt-24 w-full max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#2ecc71] [text-shadow:_0_0_15px_rgba(46,204,113,0.3)]">
              Additional Capabilities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-[0_0_30px_rgba(46,204,113,0.2)] transition-all duration-300 hover:-translate-y-1">
                <div className="text-[#2ecc71] mb-6 [filter:_drop-shadow(0_0_8px_rgba(46,204,113,0.5))]">
                  <BarChart3 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#2ecc71]">
                  Real-Time Analytics
                </h3>
                <p className="text-gray-400">
                  Monitor your data with live, interactive reports.
                </p>
              </div>
              
              <div className="bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-[0_0_30px_rgba(46,204,113,0.2)] transition-all duration-300 hover:-translate-y-1">
                <div className="text-[#2ecc71] mb-6 [filter:_drop-shadow(0_0_8px_rgba(46,204,113,0.5))]">
                  <Rocket className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#2ecc71]">
                  Fast Performance
                </h3>
                <p className="text-gray-400">
                  Experience lightning-fast speed and reliability.
                </p>
              </div>
              
              <div className="bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-[0_0_30px_rgba(46,204,113,0.2)] transition-all duration-300 hover:-translate-y-1">
                <div className="text-[#2ecc71] mb-6 [filter:_drop-shadow(0_0_8px_rgba(46,204,113,0.5))]">
                  <Lock className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#2ecc71]">
                  Secure Data Storage
                </h3>
                <p className="text-gray-400">
                  Keep your data safe with our advanced security.
                </p>
              </div>
              
              <div className="bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-[0_0_30px_rgba(46,204,113,0.2)] transition-all duration-300 hover:-translate-y-1">
                <div className="text-[#2ecc71] mb-6 [filter:_drop-shadow(0_0_8px_rgba(46,204,113,0.5))]">
                  <Settings className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#2ecc71]">
                  Customizable Options
                </h3>
                <p className="text-gray-400">
                  Tailor the system to fit your unique requirements.
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-24 text-center">
            <Link 
              href="/signup" 
              className="bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,204,113,0.4)] text-xl"
            >
              Get Started Now
            </Link>
            <p className="mt-4 text-gray-400">
              Start analyzing properties with RoseIntel today
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}