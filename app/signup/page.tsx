"use client"

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { useState } from 'react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        email,
        password,
        mode: 'signup',
        redirect: false
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError('An unexpected error occurred')
    }
  }

  const handleGoogleSignup = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 pt-16">
          <Link 
            href="/"
            className="inline-flex items-center text-[#2ecc71] hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Home</span>
          </Link>

          <div className="max-w-md mx-auto">
            <h1 className="text-5xl font-mono font-bold text-[#2ecc71] mb-12 text-center [text-shadow:_0_0_20px_rgba(46,204,113,0.3)]">
              Sign up for RoseIntel
            </h1>
            
            <div className="bg-[#111111] p-8 border border-[#2ecc71]/20">
              <form onSubmit={handleSignup}>
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded">
                    {error}
                  </div>
                )}
                
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-black border border-[#2ecc71]/20 p-3 text-white font-mono
                      focus:outline-none focus:border-[#2ecc71] transition-colors"
                    required
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-black border border-[#2ecc71]/20 p-3 text-white font-mono
                      focus:outline-none focus:border-[#2ecc71] transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-black font-mono font-bold py-3
                    transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,204,113,0.4)]"
                >
                  Sign up
                </button>

                <div className="mt-4 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#2ecc71]/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#111111] text-gray-400">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="mt-4 w-full bg-white hover:bg-gray-100 text-gray-900 font-mono font-bold py-3
                    transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </form>

              <div className="mt-6 text-center font-mono">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#2ecc71] hover:text-white transition-colors">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
