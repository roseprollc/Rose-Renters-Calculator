"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowLeft } from 'lucide-react'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const pricingPlans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: billingCycle === 'monthly' ? '/month' : 'Forever',
      features: [
        'Automated property calculations',
        'Smart URL import',
        'Email-based support'
      ],
      buttonText: 'Get Started',
      buttonLink: '/signup'
    },
    {
      name: 'Pro',
      monthlyPrice: 9,
      yearlyPrice: 59,
      description: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        'Market analysis tools',
        'AI-powered Smart Analysis',
        'Priority support'
      ],
      buttonText: 'Get Started',
      buttonLink: '/signup?plan=pro'
    },
    {
      name: 'Elite',
      monthlyPrice: 15,
      yearlyPrice: 139,
      description: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        'Everything in Pro',
        'AI Agent (custom real estate automation)',
        'Full AI-driven investment analysis',
        'Dedicated expert guidance'
      ],
      buttonText: 'Get Started',
      buttonLink: '/signup?plan=elite'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-16">
      {/* Back to Home Link */}
      <div className="w-full max-w-6xl mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-[#2ecc71] hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Heading */}
      <h1 className="text-6xl md:text-7xl font-bold mb-16 text-[#2ecc71] [text-shadow:_0_0_20px_rgba(46,204,113,0.5)]">
        Pricing
      </h1>
      
      {/* Billing Toggle */}
      <div className="inline-flex items-center rounded-full border border-[#2ecc71] p-1 mb-16">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-6 py-2 rounded-full text-lg transition-all duration-300 ${
            billingCycle === 'monthly' 
              ? 'bg-[#2ecc71] text-black font-medium [box-shadow:_0_0_15px_rgba(46,204,113,0.5)]' 
              : 'text-[#2ecc71]'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          className={`px-6 py-2 rounded-full text-lg transition-all duration-300 ${
            billingCycle === 'yearly' 
              ? 'bg-[#2ecc71] text-black font-medium [box-shadow:_0_0_15px_rgba(46,204,113,0.5)]' 
              : 'text-[#2ecc71]'
          }`}
        >
          Yearly
        </button>
      </div>
      
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {pricingPlans.map((plan, index) => (
          <div 
            key={index}
            className="border border-[#2ecc71] rounded-lg p-8 flex flex-col transition-all duration-300 hover:[box-shadow:_0_0_20px_rgba(46,204,113,0.3)] relative overflow-hidden"
          >
            <h2 className="text-3xl font-bold mb-6 text-[#2ecc71]">
              {plan.name}
            </h2>
            
            <div className="mb-8">
              <span className="text-6xl font-bold text-[#2ecc71]">
                ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
              </span>
              <span className="text-xl text-[#2ecc71] ml-1">
                {plan.description}
              </span>
            </div>
            
            <div className="flex-grow mb-8">
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="text-[#2ecc71] mr-2 h-6 w-6 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link 
              href={plan.buttonLink}
              className="border border-[#2ecc71] text-[#2ecc71] hover:bg-[#2ecc71] hover:text-black font-bold py-3 px-6 rounded-md transition-colors text-center text-lg hover:[box-shadow:_0_0_15px_rgba(46,204,113,0.5)]"
            >
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>
      
      {/* CTA Section */}
      <div className="mt-16 text-center">
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
    </div>
  )
}