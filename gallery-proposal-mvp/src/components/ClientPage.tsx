import { useState } from 'react'
import { AuctionClient, ClientNote } from '../types/auctionHouse'
import { useSpecialist } from '../contexts/SpecialistContext'
import {
  auctionClients,
  getClientById,
  getClientHistory,
  getClientNotes
} from '../data/auctionMockData'
import {
  summarizeClientBuyingHistory,
  getRelevantObjectsForClient,
  autoGenerateClientNote
} from '../services/aiLogic'

interface ClientPageProps {
  onSendToChat: (message: string) => void
  onAutoNoteGenerated?: (clientId: string, note: string) => void
}

export default function ClientPage({ onSendToChat, onAutoNoteGenerated }: ClientPageProps) {
  const { activeSpecialist } = useSpecialist()
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')

  // Filter clients by specialist
  const specialistClients = auctionClients.filter(
    c => c.primarySpecialistId === activeSpecialist?.id
  )

  const selectedClient = selectedClientId ? getClientById(selectedClientId) : null

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId)

    // Auto-generate note when client is selected
    const autoNote = autoGenerateClientNote(clientId)
    if (onAutoNoteGenerated) {
      onAutoNoteGenerated(clientId, autoNote)
    }
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return

    // In production, this would save to backend
    // For now, just send to chat
    onSendToChat(`Add note for ${selectedClient?.name}: ${newNote}`)
    setNewNote('')
  }

  return (
    <div className="flex h-full">
      {/* Client List (35%) */}
      <div className="w-[35%] border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Clients ({specialistClients.length})
          </h2>

          {specialistClients.length === 0 ? (
            <p className="text-sm text-gray-500">No clients assigned to this specialist.</p>
          ) : (
            <div className="space-y-2">
              {specialistClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => handleClientClick(client.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedClientId === client.id
                      ? 'bg-primary-50 border-primary-200'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{client.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        client.relationshipStatus === 'active'
                          ? 'bg-green-100 text-green-800'
                          : client.relationshipStatus === 'occasional'
                          ? 'bg-yellow-100 text-yellow-800'
                          : client.relationshipStatus === 'prospect'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {client.relationshipStatus}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: client.currency,
                        minimumFractionDigits: 0
                      }).format(client.totalSpent)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Client Detail (65%) */}
      <div className="flex-1 overflow-y-auto bg-white">
        {selectedClient ? (
          <ClientDetail
            client={selectedClient}
            newNote={newNote}
            setNewNote={setNewNote}
            onAddNote={handleAddNote}
            onSendToChat={onSendToChat}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
  )
}

// Client Detail Component
interface ClientDetailProps {
  client: AuctionClient
  newNote: string
  setNewNote: (note: string) => void
  onAddNote: () => void
  onSendToChat: (message: string) => void
}

function ClientDetail({ client, newNote, setNewNote, onAddNote, onSendToChat }: ClientDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'history'>('overview')
  const history = getClientHistory(client.id)
  const notes = getClientNotes(client.id)
  const summary = summarizeClientBuyingHistory(client.id)
  const relevantObjects = getRelevantObjectsForClient(client.id, true)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: client.currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <span>{client.email}</span>
          <span>•</span>
          <span>{client.phone}</span>
          <span>•</span>
          <span>{client.location}</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`px-3 py-1 text-sm font-medium rounded ${
              client.relationshipStatus === 'active'
                ? 'bg-green-100 text-green-800'
                : client.relationshipStatus === 'occasional'
                ? 'bg-yellow-100 text-yellow-800'
                : client.relationshipStatus === 'prospect'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {client.relationshipStatus}
          </span>
          <span className="text-sm text-gray-600">
            Client since {new Date(client.clientSince).getFullYear()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab client={client} summary={summary} relevantObjects={relevantObjects} onSendToChat={onSendToChat} formatCurrency={formatCurrency} />
      )}
      {activeTab === 'notes' && (
        <NotesTab notes={notes} newNote={newNote} setNewNote={setNewNote} onAddNote={onAddNote} />
      )}
      {activeTab === 'history' && (
        <HistoryTab history={history} formatCurrency={formatCurrency} />
      )}
    </div>
  )
}

// Overview Tab
function OverviewTab({ client, summary, relevantObjects, onSendToChat, formatCurrency }: any) {
  return (
    <div className="space-y-6">
      {/* Profile */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(client.totalSpent)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Budget Range</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(client.structuredProfile.typicalPriceBand.min)} - {formatCurrency(client.structuredProfile.typicalPriceBand.max)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Contact</p>
            <p className="text-sm font-medium text-gray-900">{new Date(client.lastContactDate).toLocaleDateString()}</p>
          </div>
          {client.lastPurchaseDate && (
            <div>
              <p className="text-sm text-gray-500">Last Purchase</p>
              <p className="text-sm font-medium text-gray-900">{new Date(client.lastPurchaseDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Interests */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {client.structuredProfile.interests.map((interest: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Preferred Artists */}
      {client.structuredProfile.preferredArtists.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferred Artists</h3>
          <div className="flex flex-wrap gap-2">
            {client.structuredProfile.preferredArtists.map((artist: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {artist}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buying Patterns */}
      {summary && summary.patterns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Buying Patterns</h3>
          <ul className="space-y-2">
            {summary.patterns.map((pattern: string, i: number) => (
              <li key={i} className="text-sm text-gray-700 flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                {pattern}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Objects */}
      {relevantObjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Objects</h3>
          <div className="space-y-3">
            {relevantObjects.slice(0, 3).map((match: any) => (
              <div key={match.object.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900">{match.object.title}</h4>
                <p className="text-sm text-gray-600">{match.object.artist}, {match.object.year}</p>
                <p className="text-xs text-gray-500 mt-1">{match.reasons.join('; ')}</p>
                <button
                  onClick={() => onSendToChat(`Tell me more about "${match.object.title}" by ${match.object.artist}`)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-2"
                >
                  Ask Ceqnce →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Notes Tab
function NotesTab({ notes, newNote, setNewNote, onAddNote }: any) {
  return (
    <div className="space-y-6">
      {/* Add Note Form */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Add New Note</h3>
        <div className="space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter note about this client..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          <button
            onClick={onAddNote}
            disabled={!newNote.trim()}
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">All Notes ({notes.length})</h3>
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500">No notes yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note: ClientNote) => (
              <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{note.createdBy}</p>
                    <p className="text-xs text-gray-500">{new Date(note.timestamp).toLocaleString()}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      note.source === 'auto-parse'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {note.source === 'auto-parse' ? 'Auto-parsed' : 'Manual'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{note.text}</p>
                {note.parsedData && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Extracted: {Object.entries(note.parsedData).map(([key, value]) =>
                        `${key}: ${JSON.stringify(value)}`
                      ).join(' • ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// History Tab
function HistoryTab({ history, formatCurrency }: any) {
  const [historyTab, setHistoryTab] = useState<'buying' | 'bidding' | 'consignment' | 'digital'>('buying')

  if (!history) {
    return <p className="text-sm text-gray-500">No history available.</p>
  }

  const currentHistory = history[historyTab]

  return (
    <div className="space-y-6">
      {/* History Sub-tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {(['buying', 'bidding', 'consignment', 'digital'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setHistoryTab(tab)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              historyTab === tab
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} ({history[tab].length})
          </button>
        ))}
      </div>

      {/* History Entries */}
      {currentHistory.length === 0 ? (
        <p className="text-sm text-gray-500">No {historyTab} history.</p>
      ) : (
        <div className="space-y-3">
          {currentHistory.map((entry: any) => (
            <div key={entry.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{entry.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {entry.objectTitle && `${entry.objectTitle} by ${entry.artist}`}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              {entry.amount && (
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {formatCurrency(entry.amount)}
                </p>
              )}
              <p className="text-sm text-gray-600">{entry.outcome}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
