import { useState, useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatPanel({ messages, onSendMessage, selectedCount, isLoading, onStartProposal }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            type={message.type}
            text={message.text}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Start Proposal Button (when available) */}
      {onStartProposal && (
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
          <button
            onClick={onStartProposal}
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start a Proposal
          </button>
        </div>
      )}

      {/* Selected Works Counter */}
      {selectedCount > 0 && (
        <div className="px-6 py-3 bg-primary-50 border-t border-primary-100">
          <p className="text-sm font-medium text-primary-900">
            {selectedCount} artwork{selectedCount !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what you think... or type 'export' to download PDF"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">Click artworks on the right or describe what you want</p>
      </div>
    </div>
  )
}
