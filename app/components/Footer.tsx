"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()

  // Determine if we're on a dark or light background
  const isDarkBackground = pathname?.startsWith("/dashboard") || 
                         pathname?.startsWith("/analysis") || 
                         pathname?.startsWith("/account")

  const textColor = isDarkBackground ? "text-[#2ecc71]" : "text-black"
  const hoverColor = isDarkBackground ? "hover:text-[#27ae60]" : "hover:text-[#2ecc71]"
  const bgColor = isDarkBackground ? "bg-black" : "bg-white"
  const borderColor = isDarkBackground ? "border-gray-800" : "border-gray-200"

  return (
    <footer className={`${bgColor} ${textColor} py-12`}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className={textColor}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className={`text-xl font-bold ${textColor}`}>RoseIntel</span>
            </div>
            <p className="text-sm opacity-80">
              AI-driven real estate cost analysis for investors, hosts, and renters.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className={`text-sm ${hoverColor} transition-colors`}>
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={`text-sm ${hoverColor} transition-colors`}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/calculator" className={`text-sm ${hoverColor} transition-colors`}>
                  Mortgage Calculator
                </Link>
              </li>
              <li>
                <Link href="/airbnb" className={`text-sm ${hoverColor} transition-colors`}>
                  Airbnb Calculator
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className={`text-sm ${hoverColor} transition-colors`}>
                  Wholesale Calculator
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className={`text-sm ${hoverColor} transition-colors`}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`text-sm ${hoverColor} transition-colors`}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className={`text-sm ${hoverColor} transition-colors`}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className={`text-sm ${hoverColor} transition-colors`}>
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className={`text-sm ${hoverColor} transition-colors`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={`text-sm ${hoverColor} transition-colors`}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className={`text-sm ${hoverColor} transition-colors`}>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t ${borderColor} mt-12 pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <p className="text-sm opacity-80">
            &copy; {new Date().getFullYear()} RoseIntel. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`opacity-80 ${hoverColor} transition-colors`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`opacity-80 ${hoverColor} transition-colors`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`opacity-80 ${hoverColor} transition-colors`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 