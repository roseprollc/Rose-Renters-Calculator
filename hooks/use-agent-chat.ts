import { useState, useRef, useEffect } from 'react'

export type PropertyData = {
  address: string
  source: string
  price: number
  propertyTaxes: number
  estimatedRent: number
}

type Message = {
  id: string
  content: string
  type: 'user' | 'agent'
}

export function useAgentChat(propertyData: PropertyData) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi! I'm your AI agent. I can help you analyze ${propertyData.address}. What would you like to know?`,
      type: 'agent'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      type: 'user'
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // TODO: Implement actual API call to AI agent
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock response
      const response = `I understand you're interested in ${propertyData.address}. 
        This property is listed at $${propertyData.price.toLocaleString()} with estimated monthly rent of $${propertyData.estimatedRent.toLocaleString()}.
        The annual property taxes are $${propertyData.propertyTaxes.toLocaleString()}.
        What specific aspects would you like to analyze?`

      const agentMessage: Message = {
        id: Date.now().toString(),
        content: response,
        type: 'agent'
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        type: 'agent'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    handleSubmit,
    messagesEndRef
  }
} 