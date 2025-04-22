"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { toast } from 'react-hot-toast'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mode = searchParams.get('mode') || 'login'
  const isSignUp = mode === 'signup'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        mode,
        redirect: false
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(isSignUp ? 'Account created successfully!' : 'Welcome back!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-grid-[#111111]">
        <div className="max-w-md w-full space-y-8 p-8 bg-[#111111] rounded-xl shadow-[0_0_30px_rgba(46,204,113,0.1)] border border-[#2ecc71]/20">
          <div>
            <h2 className="mt-6 text-center text-4xl font-mono font-bold text-[#2ecc71] [text-shadow:_0_0_20px_rgba(46,204,113,0.3)]">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400 font-mono">
              {isSignUp ? 'Join the future of real estate analysis' : 'Access your real estate insights'}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 border bg-[#0a0a0a] border-[#2ecc71]/20 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71]/50 focus:border-transparent font-mono text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 border bg-[#0a0a0a] border-[#2ecc71]/20 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71]/50 focus:border-transparent font-mono text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-mono font-medium rounded-lg text-black bg-[#2ecc71] hover:bg-[#2ecc71]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2ecc71] transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } [text-shadow:_0_0_10px_rgba(0,0,0,0.3)]`}
              >
                {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </div>

            <div className="text-center font-mono">
              <Link
                href={`/login?mode=${isSignUp ? 'login' : 'signup'}`}
                className="text-[#2ecc71] hover:text-[#2ecc71]/80 text-sm transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}
