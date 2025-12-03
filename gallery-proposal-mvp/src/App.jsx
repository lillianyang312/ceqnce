import { useState } from 'react'
import ChatPanel from './components/ChatPanel'
import ScreenPanel from './components/ScreenPanel'
import ClientList from './components/ClientList'
import ClientDetail from './components/ClientDetail'
import { callClaudeAPI } from './utils/claude'
import { generateProposalPDF } from './utils/exportPDF'

// Import CRM functions
import {
  getAllClients,
  getClientById,
  updateClientNotes
} from './api/crmApi'

import {
  getLikelyArtworksForClient
} from './api/recommendationEngine'

function App() {
  // View mode: 'client-detail' or 'proposal'
  const [viewMode, setViewMode] = useState('client-detail')

  // Proposal view state
  const [selectedIds, setSelectedIds] = useState([])
  const [screenMode, setScreenMode] = useState('grid') // 'grid' or 'preview'
  const [isLoading, setIsLoading] = useState(false)

  // CRM state
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [clients, setClients] = useState(getAllClients())

  // Chat state - initialize with welcome message
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi, I'm Ceqnce! What can I help you with today?",
    }
  ])

  const toggleArtwork = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleSendMessage = async (text) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const result = await callClaudeAPI(text, selectedIds, screenMode)

      // Handle export command
      if (result.commands.export && selectedIds.length > 0) {
        try {
          await generateProposalPDF(selectedIds)
        } catch (error) {
          console.error('Error generating PDF:', error)
        }
      }

      // Handle artwork selections
      for (const artworkId of result.commands.add) {
        if (!selectedIds.includes(artworkId)) {
          setSelectedIds(prev => [...prev, artworkId])
        }
      }

      for (const artworkId of result.commands.remove) {
        setSelectedIds(prev => prev.filter(id => id !== artworkId))
      }

      // Add AI message
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: result.text,
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: `Sorry, I encountered an error: ${error.message}. Please check that your API key is set correctly in the .env file.`,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // CRM handlers
  const handleSelectClient = (clientId) => {
    setSelectedClientId(clientId)
    setViewMode('client-detail')

    // Update chat with client context
    const client = getClientById(clientId)
    if (client) {
      setMessages([
        {
          id: 1,
          type: 'ai',
          text: `Hi, I'm Ceqnce! I'm here to help with ${client.name}.\n\nWhat would you like to do?\n\n• Ask me questions about ${client.name}'s collecting history\n• Get artwork recommendations\n• Start a proposal`,
        }
      ])
    }
  }

  const handleUpdateClientNotes = (newNote) => {
    if (selectedClientId) {
      const updatedClient = updateClientNotes(selectedClientId, newNote)
      if (updatedClient) {
        // Refresh clients list
        setClients(getAllClients())

        // Add message to chat
        const aiMessage = {
          id: messages.length + 1,
          type: 'ai',
          text: `Note added successfully! I've updated ${updatedClient.name}'s profile based on the note content.`,
        }
        setMessages(prev => [...prev, aiMessage])
      }
    }
  }

  const handleStartProposal = () => {
    if (!selectedClientId) return

    const client = getClientById(selectedClientId)
    if (!client) return

    // Clear selections and switch to proposal mode
    setSelectedIds([])
    setViewMode('proposal')

    // Update chat for proposal context
    const aiMessage = {
      id: messages.length + 1,
      type: 'ai',
      text: `Great! I'm showing artworks for ${client.name}.\n\n${client.structuredProfile.interests.length > 0 ? `They're interested in: ${client.structuredProfile.interests.join(', ')}.` : ''}\n\nBudget: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(client.typicalPriceBand.min)} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(client.typicalPriceBand.max)}\n\nClick artworks to add them, or ask me questions!`,
    }
    setMessages(prev => [...prev, aiMessage])
  }

  const handleBackToClient = () => {
    setViewMode('client-detail')
    setSelectedIds([])

    const client = getClientById(selectedClientId)
    if (client) {
      const aiMessage = {
        id: messages.length + 1,
        type: 'ai',
        text: `Back to ${client.name}'s profile. What would you like to do next?`,
      }
      setMessages(prev => [...prev, aiMessage])
    }
  }

  // Get current client data and recommendations
  const currentClient = selectedClientId ? getClientById(selectedClientId) : null
  const clientRecommendations = selectedClientId
    ? getLikelyArtworksForClient(selectedClientId, 10)
    : []

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Ceqnce</h1>
        <p className="text-sm text-gray-500 mt-1">AI-copilot for specialists</p>
      </div>

      {/* Main Content: Chat (Left) + Content (Right) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat Panel (40%) - ALWAYS VISIBLE */}
        <div className="w-2/5 border-r border-gray-200 flex flex-col bg-white">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            selectedCount={selectedIds.length}
            isLoading={isLoading}
            onStartProposal={selectedClientId && viewMode === 'client-detail' ? handleStartProposal : null}
          />
        </div>

        {/* Right: Content Area (60%) - Switches between views */}
        <div className="w-3/5 flex flex-col bg-gray-50">
          {viewMode === 'proposal' ? (
            /* Proposal View with Back Button */
            <div className="flex flex-col h-full">
              <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Proposal for {currentClient?.name}
                </h2>
                <button
                  onClick={handleBackToClient}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Back to Client
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ScreenPanel
                  mode={screenMode}
                  setMode={setScreenMode}
                  selectedIds={selectedIds}
                  onToggleArtwork={toggleArtwork}
                />
              </div>
            </div>
          ) : (
            /* Client View: List + Detail */
            <div className="flex h-full">
              {/* Client List (35%) */}
              <div className="w-[35%] border-r border-gray-200">
                <ClientList
                  clients={clients}
                  onSelectClient={handleSelectClient}
                  selectedClientId={selectedClientId}
                />
              </div>

              {/* Client Detail (65%) */}
              <div className="flex-1">
                {currentClient ? (
                  <ClientDetail
                    client={currentClient}
                    recommendations={clientRecommendations}
                    onUpdateNotes={handleUpdateClientNotes}
                    onSelectArtwork={() => {}}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No client selected</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Select a client from the list to view details
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
