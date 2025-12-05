import { useState } from 'react'
import { SpecialistProvider, useSpecialist } from './contexts/SpecialistContext'
import ChatPanel from './components/ChatPanel'
import SpecialistSelector from './components/SpecialistSelector'
import ObjectPage from './components/ObjectPage'
import ClientPage from './components/ClientPage'
import { autoGenerateClientNote } from './services/aiLogic'

function AppContent() {
  const { activeSpecialist } = useSpecialist()

  // Active tab: 'objects' or 'clients'
  const [activeTab, setActiveTab] = useState('clients')

  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi, I'm Ceqnce! I'm your AI copilot for specialist work. What can I help you with today?",
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (text) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: generateAIResponse(text),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSendToChat = (message) => {
    handleSendMessage(message)
  }

  const handleAutoNoteGenerated = (clientId, note) => {
    // Add auto-generated note to chat
    const aiMessage = {
      id: messages.length + 1,
      type: 'ai',
      text: note,
    }
    setMessages(prev => [...prev, aiMessage])
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Main Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ceqnce</h1>
            <p className="text-sm text-gray-500 mt-1">AI copilot for specialists</p>
          </div>
          <SpecialistSelector />
        </div>
      </div>

      {/* Main Content: Chat (Left) + Content (Right) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat Panel (40%) - ALWAYS VISIBLE */}
        <div className="w-2/5 border-r border-gray-200 flex flex-col bg-white">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            selectedCount={0}
            isLoading={isLoading}
            onStartProposal={null}
          />
        </div>

        {/* Right: Content Area (60%) */}
        <div className="w-3/5 flex flex-col bg-gray-50">
          {/* Content Header with Tabs */}
          <div className="border-b border-gray-200 bg-white">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab('objects')}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'objects'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Objects
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'clients'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Clients
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'objects' ? (
              <ObjectPage onSendToChat={handleSendToChat} />
            ) : (
              <ClientPage
                onSendToChat={handleSendToChat}
                onAutoNoteGenerated={handleAutoNoteGenerated}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple AI response generator (simulated)
function generateAIResponse(userText) {
  const lowerText = userText.toLowerCase()

  if (lowerText.includes('tell me more about') || lowerText.includes('who is')) {
    return "I'd be happy to provide more information. Based on the data I have, this is a valuable opportunity. Would you like me to analyze their buying history or suggest relevant objects?"
  }

  if (lowerText.includes('recommend') || lowerText.includes('suggest')) {
    return "Based on the client's profile and collecting history, I've identified several relevant works that might interest them. Would you like me to prioritize by price range or artist?"
  }

  if (lowerText.includes('history') || lowerText.includes('purchased') || lowerText.includes('bought')) {
    return "Looking at their purchase history, they tend to focus on blue-chip artists with strong provenance. They're typically decisive buyers when the right work comes along."
  }

  if (lowerText.includes('note') || lowerText.includes('add')) {
    return "I've noted that information in the client's profile. I'll use this to improve future recommendations and identify relevant opportunities."
  }

  return "I understand. How can I help you with this? I can provide client insights, match buyers to objects, or suggest relevant works based on collecting patterns."
}

function App() {
  return (
    <SpecialistProvider>
      <AppContent />
    </SpecialistProvider>
  )
}

export default App
