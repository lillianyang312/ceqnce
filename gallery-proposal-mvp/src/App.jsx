import { useState } from 'react'
import ChatPanel from './components/ChatPanel'
import ScreenPanel from './components/ScreenPanel'
import { callClaudeAPI } from './utils/claude'
import { generateProposalPDF } from './utils/exportPDF'

function App() {
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

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-4 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Gallery Proposal Generator</h1>
        <p className="text-sm text-gray-500 mt-1">Create professional artwork proposals through conversation</p>
      </div>

      {/* Split Screen: Chat (40%) + Screen (60%) */}
      <div className="flex flex-1 overflow-hidden">
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
    </div>
  )
}

export default App
