"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, X } from 'lucide-react'

// Simple Toast component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [onClose])
  
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg ${
      type === 'success' ? 'bg-[#2ecc71] text-black' : 'bg-red-500 text-white'
    }`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 rounded-full p-1 hover:bg-black/10">
        <X size={16} />
      </button>
    </div>
  )
}

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call - would be replaced with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful submission
      showToast("✅ Message sent successfully!", "success")
      
      // Reset form
      setName('')
      setEmail('')
      setMessage('')
    } catch (error) {
      showToast("❌ Something went wrong. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#2ecc71] hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-bold mb-4 text-[#2ecc71] [text-shadow:_0_0_20px_rgba(46,204,113,0.5)]">
            Contact
          </h1>
          <p className="text-xl text-gray-300">
            Questions? We're here to help.
          </p>
        </div>
        
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-4 text-[#2ecc71] bg-black border-2 border-[#2ecc71] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2ecc71] placeholder-[#2ecc71] [box-shadow:_0_0_10px_rgba(46,204,113,0.3)]"
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-4 text-[#2ecc71] bg-black border-2 border-[#2ecc71] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2ecc71] placeholder-[#2ecc71] [box-shadow:_0_0_10px_rgba(46,204,113,0.3)]"
            />
          </div>
          
          <div>
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-4 text-[#2ecc71] bg-black border-2 border-[#2ecc71] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#2ecc71] placeholder-[#2ecc71] [box-shadow:_0_0_10px_rgba(46,204,113,0.3)]"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 text-xl font-bold text-black bg-[#2ecc71] rounded-full hover:bg-[#27ae60] transition-colors disabled:opacity-70 [box-shadow:_0_0_15px_rgba(46,204,113,0.5)]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
        
        {/* Additional Contact Info */}
        <div className="mt-10 text-center">
          <p className="text-[#2ecc71]">
            For urgent matters, email us at{' '}
            <a 
              href="mailto:support@roseintel.com" 
              className="underline hover:text-white transition-colors"
            >
              support@roseintel.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}