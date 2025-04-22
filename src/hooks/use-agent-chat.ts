"use client"

import { useState } from "react"

export type PropertyData = {
  address: string
  source: string
  taxes: number
  rent: number
  estimatedValue: number
}

export function useAgentChat() {
  const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string }[]>([])

  const sendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }])

    // Simulate loading delay & response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "user", text },
        {
          role: "agent",
          text: "Here's a smart insight about your property. (This will be replaced by actual GPT output.)",
        },
      ])
    }, 1000)
  }

  return {
    messages,
    sendMessage,
  }
}
