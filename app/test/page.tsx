"use client"

import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'

export default function TestPage() {
  const [serverStatus, setServerStatus] = useState<string>('Checking...')
  const [apiStatus, setApiStatus] = useState<string>('Not tested')
  const [testData, setTestData] = useState<any>(null)
  const [testUrl, setTestUrl] = useState<string>('https://www.redfin.com/NY/Buffalo/33-Montrose-Ave-14214/home/184743971')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    // Check server health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setServerStatus('Server is running')
        console.log('Health check response:', data)
      })
      .catch(err => {
        setServerStatus('Server error: ' + err.message)
        console.error('Health check error:', err)
      })
  }, [])

  const testApiProviders = async () => {
    setIsLoading(true)
    setApiStatus('Testing...')
    try {
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl })
      })
      
      const data = await response.json()
      setTestData(data)
      
      if (!response.ok) {
        setApiStatus('API test failed: ' + (data.error || 'Unknown error'))
      } else {
        setApiStatus('API test successful')
      }
    } catch (error) {
      setApiStatus('API test failed: ' + (error instanceof Error ? error.message : String(error)))
      console.error('API test error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestUrl(e.target.value)
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-8 text-[#2ecc71]">System Test Page</h1>
        
        <div className="bg-[#111111] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Server Status</h2>
          <p className={serverStatus.includes('running') ? 'text-green-500' : 'text-red-500'}>
            {serverStatus}
          </p>
        </div>
        
        <div className="bg-[#111111] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">API Providers Test</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Test URL:</label>
            <input
              type="text"
              value={testUrl}
              onChange={handleUrlChange}
              className="w-full bg-[#222222] border border-[#2ecc71]/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#2ecc71]"
              placeholder="Enter URL to test"
            />
          </div>
          
          <button 
            onClick={testApiProviders}
            disabled={isLoading}
            className={`bg-[#2ecc71] text-black px-4 py-2 rounded mb-4 hover:bg-[#27ae60] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Testing...' : 'Test API Providers'}
          </button>
          
          <p className={apiStatus.includes('successful') ? 'text-green-500' : 'text-yellow-500'}>
            {apiStatus}
          </p>
          
          {testData && (
            <div className="mt-4 p-4 bg-[#222222] rounded">
              <h3 className="font-bold mb-2">Test Data:</h3>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(testData, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-[#111111] p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Next Steps</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>If server status is green, the backend is running correctly</li>
            <li>If API test is successful, the data providers are working</li>
            <li>If you see test data, the API is returning the expected format</li>
            <li>If you encounter errors, check the console for more details</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
} 