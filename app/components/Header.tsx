"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, LogOut, ChevronDown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import RoseLogo from "./RoseLogo"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCalculatorDropdownOpen, setIsCalculatorDropdownOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  // Determine if we're on a dark background
  const isDarkBackground = pathname === '/' || 
    pathname === '/features' || 
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/calculator') || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/ai-upgrade') ||
    pathname.startsWith('/analysis') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/airbnb') ||
    pathname.startsWith('/wholesale') ||
    pathname.startsWith('/renters')

  // For dark backgrounds (black), use neon green text
  // For light backgrounds (white), use black text
  const textColor = isDarkBackground ? "text-[#2ecc71]" : "text-black"
  const hoverColor = isDarkBackground ? "hover:text-[#27ae60]" : "hover:text-[#2ecc71]"
  const bgColor = isDarkBackground ? "bg-black" : "bg-white"
  const buttonBgColor = isDarkBackground ? "bg-[#2ecc71]" : "bg-black"
  const buttonTextColor = isDarkBackground ? "text-black" : "text-white"
  const buttonHoverColor = isDarkBackground ? "hover:bg-[#27ae60]" : "hover:bg-gray-800"

  // Check if we're on the dashboard or related pages
  const isInDashboard = ["/dashboard", "/analysis", "/account"].some(path => pathname?.startsWith(path))

  return (
    <header className={`${bgColor} border-b ${isDarkBackground ? "border-[#2ecc71]/20" : "border-black/10"} fixed w-full top-0 z-[100]`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => handleNavigation('/')} className="flex items-center gap-2">
          <RoseLogo className={textColor} />
          <span className={`text-3xl font-bold ${textColor}`}>RoseIntel</span>
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!isInDashboard ? (
            <>
              <div className="relative">
                <button 
                  onClick={() => setIsCalculatorDropdownOpen(!isCalculatorDropdownOpen)}
                  className={`${textColor} ${hoverColor} transition-colors text-lg font-medium flex items-center gap-1`}
                >
                  Calculators
                  <ChevronDown size={16} />
                </button>
                {isCalculatorDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 py-2 px-4 bg-black border border-[#2ecc71]/20 rounded-lg shadow-lg min-w-[200px]"
                    onMouseLeave={() => setIsCalculatorDropdownOpen(false)}
                  >
                    <button
                      onClick={() => handleNavigation('/airbnb')}
                      className={`block w-full text-left py-2 ${textColor} ${hoverColor} transition-colors`}
                    >
                      Airbnb Calculator
                    </button>
                    <button
                      onClick={() => handleNavigation('/renters')}
                      className={`block w-full text-left py-2 ${textColor} ${hoverColor} transition-colors`}
                    >
                      Rental Calculator
                    </button>
                    <button
                      onClick={() => handleNavigation('/wholesale')}
                      className={`block w-full text-left py-2 ${textColor} ${hoverColor} transition-colors`}
                    >
                      Wholesale Calculator
                    </button>
                    <button
                      onClick={() => handleNavigation('/calculator')}
                      className={`block w-full text-left py-2 ${textColor} ${hoverColor} transition-colors`}
                    >
                      Mortgage Calculator
                    </button>
                  </div>
                )}
              </div>
              <button onClick={() => handleNavigation('/features')} className={`${textColor} ${hoverColor} transition-colors text-lg font-medium`}>
                Features
              </button>
              <button onClick={() => handleNavigation('/pricing')} className={`${textColor} ${hoverColor} transition-colors text-lg font-medium`}>
                Pricing
              </button>
              <button onClick={() => handleNavigation('/contact')} className={`${textColor} ${hoverColor} transition-colors text-lg font-medium`}>
                Contact
              </button>
              {status === 'authenticated' ? (
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className={`${buttonBgColor} ${buttonTextColor} px-6 py-2 rounded-lg font-medium ${buttonHoverColor} transition-colors`}
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => handleNavigation('/login')} className={`${textColor} ${hoverColor} transition-colors text-lg font-medium`}>
                    Log in
                  </button>
                  <button 
                    onClick={() => handleNavigation('/signup')}
                    className={`${buttonBgColor} ${buttonTextColor} px-6 py-2 rounded-lg font-medium ${buttonHoverColor} transition-colors`}
                  >
                    Sign up
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-2 ${buttonBgColor} ${buttonTextColor} px-6 py-2 rounded-lg font-medium ${buttonHoverColor} transition-colors`}
            >
              <LogOut size={20} />
              Sign out
            </button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden ${textColor}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`fixed top-0 left-0 w-full h-screen ${bgColor} z-[200] flex flex-col items-center justify-center md:hidden`}>
            <button 
              className={`absolute top-8 right-8 ${textColor}`}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center gap-8">
              <button 
                onClick={() => handleNavigation('/features')}
                className={`${textColor} ${hoverColor} transition-colors text-xl font-medium`}
              >
                Features
              </button>
              <button 
                onClick={() => handleNavigation('/pricing')}
                className={`${textColor} ${hoverColor} transition-colors text-xl font-medium`}
              >
                Pricing
              </button>
              <button 
                onClick={() => handleNavigation('/contact')}
                className={`${textColor} ${hoverColor} transition-colors text-xl font-medium`}
              >
                Contact
              </button>
              
              {status === 'authenticated' ? (
                <>
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className={`${buttonBgColor} ${buttonTextColor} px-8 py-3 rounded-lg font-medium ${buttonHoverColor} transition-colors`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className={`flex items-center gap-2 ${buttonBgColor} ${buttonTextColor} px-8 py-3 rounded-lg font-medium ${buttonHoverColor} transition-colors`}
                  >
                    <LogOut size={24} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleNavigation('/login')}
                    className={`${textColor} ${hoverColor} transition-colors text-xl font-medium`}
                  >
                    Log in
                  </button>
                  <button 
                    onClick={() => handleNavigation('/signup')}
                    className={`${buttonBgColor} ${buttonTextColor} px-8 py-3 rounded-lg font-medium ${buttonHoverColor} transition-colors`}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 