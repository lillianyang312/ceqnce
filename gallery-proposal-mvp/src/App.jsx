import { useState } from 'react'
import { SpecialistProvider, useSpecialist } from './contexts/SpecialistContext'
import ChatPanel from './components/ChatPanel'
import SpecialistSelector from './components/SpecialistSelector'
import ObjectPage from './components/ObjectPage'
import ClientPage from './components/ClientPage'
import {
  autoGenerateClientNote,
  getLikelyBuyersForObject,
  getRelevantObjectsForClient,
  summarizeClientBuyingHistory
} from './services/aiLogic'
import { objects, auctionClients } from './data/auctionMockData'

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

    // Generate smart AI response
    setTimeout(() => {
      const response = generateSmartAIResponse(text)
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: response,
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

// Smart AI response generator that searches real data
function generateSmartAIResponse(userText) {
  const lowerText = userText.toLowerCase()

  // Search for artwork mentions
  const foundObject = objects.find(obj =>
    lowerText.includes(obj.title.toLowerCase()) ||
    lowerText.includes(obj.artist.toLowerCase()) ||
    (lowerText.includes('kusama') && obj.artist === 'Yayoi Kusama') ||
    (lowerText.includes('infinity net') && obj.title.includes('Infinity Net'))
  )

  if (foundObject && (lowerText.includes('buyer') || lowerText.includes('follow up') || lowerText.includes('who should'))) {
    const buyers = getLikelyBuyersForObject(foundObject.id)

    if (buyers.length === 0) {
      return `I found "${foundObject.title}" by ${foundObject.artist}, but I don't have any strong buyer matches for this work at the moment.`
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(amount)
    }

    let response = `**Buyers for "${foundObject.title}" by ${foundObject.artist}**\n\n`

    if (foundObject.isBeingSoldNow) {
      response += `Estimate: ${formatCurrency(foundObject.estimateLow)} - ${formatCurrency(foundObject.estimateHigh)}\n`
      response += `Sale: ${foundObject.saleName} (${foundObject.saleDate})\n\n`
    }

    response += `**Top ${Math.min(5, buyers.length)} Potential Buyers:**\n\n`

    buyers.slice(0, 5).forEach((match, index) => {
      response += `${index + 1}. **${match.client.name}** (${match.score}% match)\n`
      response += `   Location: ${match.client.location}\n`
      response += `   Status: ${match.client.relationshipStatus}\n`
      response += `   Budget: ${formatCurrency(match.client.structuredProfile.typicalPriceBand.min)} - ${formatCurrency(match.client.structuredProfile.typicalPriceBand.max)}\n`
      response += `   Why: ${match.reasons.join(', ')}\n\n`
    })

    response += `\nWould you like me to provide more details on any of these clients?`
    return response
  }

  // Search for client mentions
  const foundClient = auctionClients.find(client =>
    lowerText.includes(client.name.toLowerCase())
  )

  if (foundClient) {
    const summary = summarizeClientBuyingHistory(foundClient.id)

    if (summary) {
      let response = `**${foundClient.name}**\n\n`
      response += `Status: ${foundClient.relationshipStatus} client since ${new Date(foundClient.clientSince).getFullYear()}\n`
      response += `Total purchases: ${summary.totalPurchases} (${new Intl.NumberFormat('en-US', { style: 'currency', currency: foundClient.currency, minimumFractionDigits: 0 }).format(summary.totalSpent)})\n\n`

      if (summary.preferredArtists.length > 0) {
        response += `**Collects:** ${summary.preferredArtists.slice(0, 3).map(a => a.artist).join(', ')}\n\n`
      }

      if (summary.patterns.length > 0) {
        response += `**Buying Pattern:** ${summary.patterns[0]}\n\n`
      }

      response += `${summary.recentActivity}\n\n`
      response += `Would you like to see recommended objects for this client?`
      return response
    }
  }

  // Generic helpful responses
  if (lowerText.includes('recommend') || lowerText.includes('suggest')) {
    return "I can help with recommendations! Just tell me:\n• The client name (e.g., 'recommend objects for Jennifer Park')\n• Or the artwork (e.g., 'who should I contact about the Kusama piece?')"
  }

  if (lowerText.includes('history') || lowerText.includes('purchased') || lowerText.includes('bought')) {
    return "I can analyze purchase history! Just mention a client name (e.g., 'Tell me about Marcus Chen's buying history')"
  }

  return "I can help you:\n• Find buyers for specific artworks\n• Analyze client buying patterns\n• Recommend objects for clients\n• Identify follow-up priorities\n\nJust ask about a specific client or artwork!"
}

function App() {
  return (
    <SpecialistProvider>
      <AppContent />
    </SpecialistProvider>
  )
}

export default App
