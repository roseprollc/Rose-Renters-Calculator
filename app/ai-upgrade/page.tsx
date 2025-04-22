"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from 'lucide-react'
import PageLayout from "../components/PageLayout"

export default function AIUpgradePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  const plans = {
    monthly: {
      price: 15.00,
      features: [
        "AI Property Analysis",
        "Market Trend Predictions",
        "Investment Strategy Recommendations",
        "Automated Comps Analysis",
        "Risk Assessment",
        "Unlimited Calculations",
        "Priority Support"
      ]
    },
    yearly: {
      price: 139.00,
      features: [
        "All Monthly Features",
        "2 Months Free",
        "Advanced Market Reports",
        "Custom Investment Criteria",
        "Portfolio Optimization",
        "ROI Forecasting",
        "1-on-1 Strategy Session"
      ]
    }
  }

  // Calculate savings percentage
  const monthlyAnnualCost = plans.monthly.price * 12
  const yearlySavings = ((monthlyAnnualCost - plans.yearly.price) / monthlyAnnualCost) * 100
  const savingsPercentage = Math.round(yearlySavings)

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          priceId: plan === 'monthly' ? 'price_monthly_id' : 'price_yearly_id'
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-black text-[#2ecc71]">
        <div className="max-w-4xl mx-auto p-8 pt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Upgrade to AI-Powered Analysis</h2>
            <p className="text-xl text-gray-300">Get instant, data-driven insights for smarter real estate decisions</p>
          </div>

          {/* Plan Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center rounded-full border border-[#2ecc71] p-1">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-2 rounded-full text-lg transition-all duration-300 ${
                  selectedPlan === 'monthly' 
                    ? 'bg-[#2ecc71] text-black font-medium [box-shadow:_0_0_15px_rgba(46,204,113,0.5)]' 
                    : 'text-[#2ecc71]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-2 rounded-full text-lg transition-all duration-300 ${
                  selectedPlan === 'yearly' 
                    ? 'bg-[#2ecc71] text-black font-medium [box-shadow:_0_0_15px_rgba(46,204,113,0.5)]' 
                    : 'text-[#2ecc71]'
                }`}
              >
                Yearly (Save {savingsPercentage}%)
              </button>
            </div>
          </div>

          {/* Single Pricing Card */}
          <div className="max-w-md mx-auto mb-12">
            {selectedPlan === 'monthly' ? (
              <div className="bg-neutral-900 rounded-lg p-8 border-2 border-[#2ecc71] shadow-[0_0_30px_rgba(46,204,113,0.2)]">
                <h3 className="text-3xl font-bold mb-4">Elite Plan</h3>
                <div className="text-4xl font-bold mb-6">
                  ${plans.monthly.price.toFixed(2)}
                  <span className="text-xl text-gray-400">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plans.monthly.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="text-[#2ecc71] mr-2 h-6 w-6 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={isLoading}
                  className="w-full py-4 rounded-lg text-xl font-medium bg-[#2ecc71] text-black hover:bg-[#27ae60] transition-colors duration-200"
                >
                  {isLoading ? 'Processing...' : 'Subscribe Monthly'}
                </button>
              </div>
            ) : (
              <div className="bg-neutral-900 rounded-lg p-8 border-2 border-[#2ecc71] shadow-[0_0_30px_rgba(46,204,113,0.2)]">
                <h3 className="text-3xl font-bold mb-4">Elite Plan</h3>
                <div className="text-4xl font-bold mb-6">
                  ${plans.yearly.price.toFixed(2)}
                  <span className="text-xl text-gray-400">/year</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plans.yearly.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="text-[#2ecc71] mr-2 h-6 w-6 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe('yearly')}
                  disabled={isLoading}
                  className="w-full py-4 rounded-lg text-xl font-medium bg-[#2ecc71] text-black hover:bg-[#27ae60] transition-colors duration-200"
                >
                  {isLoading ? 'Processing...' : 'Subscribe Yearly'}
                </button>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-2">AI Analysis</h3>
              <p className="text-gray-300">Get instant property insights powered by advanced AI algorithms</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-2">Market Trends</h3>
              <p className="text-gray-300">Stay ahead with real-time market analysis and predictions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-2">Smart Recommendations</h3>
              <p className="text-gray-300">Receive personalized investment strategies and opportunities</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-12">
            <p className="text-xl text-[#2ecc71]">
              Have questions? {' '}
              <Link 
                href="/contact" 
                className="underline hover:text-white transition-colors [text-shadow:_0_0_10px_rgba(46,204,113,0.5)]"
              >
                Contact us
              </Link>
            </p>
          </div>

          {/* Back Navigation */}
          <div className="text-center">
            <Link
              href="/calculator"
              className="text-xl hover:text-[#27ae60] transition-colors duration-200"
            >
              Return to Calculator
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 