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
  const [currentView, setCurrentView] = useState('proposals') // 'proposals', 'clients', 'artworks'

  // Proposal view state (original)
  const [selectedIds, setSelectedIds] = useState([])
  const [screenMode, setScreenMode] = useState('grid') // 'grid' or 'preview'
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi! I'm helping you create a proposal for Jane Chen. She loves Postwar Abstraction and has a budget of $250K-$1M.\n\nI'm showing 8 works that might interest her. Click any artwork to add it, or tell me which ones you like.",
    }
  ])
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
          <h1 className="text-2xl font-bold text-gray-900">Ashford Contemporary CRM</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered gallery management system</p>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setCurrentView('proposals')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'proposals'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Proposal Generator
            </button>
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
            <button
              onClick={() => setCurrentView('artworks')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'artworks'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Artworks
            </button>
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

        {/* ARTWORKS VIEW (Placeholder) */}
        {currentView === 'artworks' && (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Artwork Gallery View</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md">
                Enhanced artwork list view with filtering, price history, and client recommendations.
                <br />
                <span className="text-blue-600 font-medium">Coming soon!</span>
              </p>
              <p className="mt-4 text-xs text-gray-400">
                For now, you can use the Proposal Generator tab to view artworks
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
