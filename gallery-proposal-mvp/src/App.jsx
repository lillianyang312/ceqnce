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
  // Navigation state
  const [currentView, setCurrentView] = useState('clients') // 'proposals' or 'clients' - default to clients
  const [proposalClientId, setProposalClientId] = useState(null) // Track which client the proposal is for

  // Proposal view state (original)
  const [selectedIds, setSelectedIds] = useState([])
  const [screenMode, setScreenMode] = useState('grid') // 'grid' or 'preview'
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // CRM state
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [clients, setClients] = useState(getAllClients())
  const [selectedArtworkId, setSelectedArtworkId] = useState(null)

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
  }

  const handleUpdateClientNotes = (newNote) => {
    if (selectedClientId) {
      const updatedClient = updateClientNotes(selectedClientId, newNote)
      if (updatedClient) {
        // Refresh clients list
        setClients(getAllClients())

        // Show success message
        alert(`Note added successfully!\n\nProfile was automatically updated based on the note content.`)
      }
    }
  }

  const handleSelectArtwork = (artworkId) => {
    setSelectedArtworkId(artworkId)
    // Could navigate to artwork detail view here
    console.log('Selected artwork:', artworkId)
  }

  const handleStartProposal = (clientId) => {
    const client = getClientById(clientId)
    if (!client) return

    // Set up proposal for this client
    setProposalClientId(clientId)
    setSelectedIds([])

    // Initialize chat with client context
    setMessages([
      {
        id: 1,
        type: 'ai',
        text: `Hi! I'm helping you create a proposal for ${client.name}.\n\n${client.structuredProfile.interests.length > 0 ? `They're interested in: ${client.structuredProfile.interests.join(', ')}.` : ''}\n\nBudget: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(client.typicalPriceBand.min)} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(client.typicalPriceBand.max)}\n\nI'm showing artworks that match their profile. Click any artwork to add it to the proposal, or ask me questions about ${client.name}'s history and preferences.`,
      }
    ])

    // Switch to proposals view
    setCurrentView('proposals')
  }

  // Get current client data and recommendations
  const currentClient = selectedClientId ? getClientById(selectedClientId) : null
  const clientRecommendations = selectedClientId
    ? getLikelyArtworksForClient(selectedClientId, 10)
    : []

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header with Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Cequence</h1>
          <p className="text-sm text-gray-500 mt-1">AI-copilot for specialists</p>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setCurrentView('clients')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'clients'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clients ({clients.length})
            </button>
            {proposalClientId && (
              <button
                onClick={() => setCurrentView('proposals')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentView === 'proposals'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Proposal for {getClientById(proposalClientId)?.name}
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* PROPOSALS VIEW (Original) */}
        {currentView === 'proposals' && (
          <div className="flex h-full">
            {/* Left: Chat Panel (40%) */}
            <div className="w-2/5 border-r border-gray-200 flex flex-col bg-white">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                selectedCount={selectedIds.length}
                isLoading={isLoading}
              />
            </div>

            {/* Right: Screen Panel (60%) */}
            <div className="w-3/5 flex flex-col bg-gray-50">
              <ScreenPanel
                mode={screenMode}
                setMode={setScreenMode}
                selectedIds={selectedIds}
                onToggleArtwork={toggleArtwork}
              />
            </div>
          </div>
        )}

        {/* CLIENTS VIEW (New CRM) */}
        {currentView === 'clients' && (
          <div className="flex h-full">
            {/* Left: Client List (30%) */}
            <div className="w-[30%] border-r border-gray-200">
              <ClientList
                clients={clients}
                onSelectClient={handleSelectClient}
                selectedClientId={selectedClientId}
              />
            </div>

            {/* Right: Client Detail (70%) */}
            <div className="flex-1">
              {currentClient ? (
                <ClientDetail
                  client={currentClient}
                  recommendations={clientRecommendations}
                  onUpdateNotes={handleUpdateClientNotes}
                  onSelectArtwork={handleSelectArtwork}
                  onStartProposal={handleStartProposal}
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
  )
}

export default App
