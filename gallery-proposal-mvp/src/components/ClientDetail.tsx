/**
 * ClientDetail Component
 *
 * Displays comprehensive information about a single client including:
 * - Basic info and structured profile
 * - Purchase history
 * - Consignment history (with special attention to incomplete/failed)
 * - Digital engagements
 * - Recommended artworks
 * - Notes section with ability to add new notes
 */

import React, { useState } from 'react'
import type { Client, ArtworkRecommendation } from '../types'
import { getArtworkById } from '../api/crmApi'

interface ClientDetailProps {
  client: Client
  recommendations: ArtworkRecommendation[]
  onUpdateNotes: (notes: string) => void
  onSelectArtwork: (artworkId: string) => void
  onStartProposal: (clientId: string) => void
}

export default function ClientDetail({
  client,
  recommendations,
  onUpdateNotes,
  onSelectArtwork,
  onStartProposal
}: ClientDetailProps) {
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'purchases' | 'consignments' | 'engagements'>('overview')

  const handleAddNote = () => {
    if (newNote.trim()) {
      onUpdateNotes(newNote.trim())
      setNewNote('')
      setIsAddingNote(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getConsignmentStatusColor = (status: string) => {
    switch (status) {
      case 'sold_here': return 'bg-green-100 text-green-800'
      case 'withdrawn': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-orange-100 text-orange-800'
      case 'sale_failed': return 'bg-red-100 text-red-800'
      case 'consigned': return 'bg-blue-100 text-blue-800'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalSpent = client.purchaseHistory.reduce((sum, p) => sum + p.pricePaid, 0)

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
              {client.tags.includes('VIP') && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  VIP
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{client.location}</p>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
          <div className="text-right space-y-2">
            <button
              onClick={() => onStartProposal(client.id)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start a Proposal
            </button>
            <div>
              <div className="text-xs text-gray-500">Lifetime Value</div>
              <div className="text-xl font-bold text-gray-900">{formatPrice(totalSpent)}</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {client.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'purchases', label: `Purchases (${client.purchaseHistory.length})` },
            { key: 'consignments', label: `Consignments (${client.consignmentHistory.length})` },
            { key: 'engagements', label: `Engagement (${client.digitalEngagements.length})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Structured Profile */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Collector Profile</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <span className="text-xs text-gray-500 block">Relationship Status</span>
                  <span className="text-sm font-medium text-gray-900">
                    {client.structuredProfile.relationshipStatus}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Decision Speed</span>
                  <span className="text-sm font-medium text-gray-900">
                    {client.structuredProfile.decisionSpeed}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Negotiation Style</span>
                  <span className="text-sm font-medium text-gray-900">
                    {client.structuredProfile.negotiationStyle}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Price Sensitivity</span>
                  <span className="text-sm font-medium text-gray-900">
                    {client.structuredProfile.priceSensitivity}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Risk Tolerance</span>
                  <span className="text-sm font-medium text-gray-900">
                    {client.structuredProfile.riskTolerance}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Budget Range</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(client.typicalPriceBand.min)} - {formatPrice(client.typicalPriceBand.max)}
                  </span>
                </div>
              </div>

              {/* Interests */}
              {client.structuredProfile.interests.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs text-gray-500 block mb-2">Interests</span>
                  <div className="flex gap-2 flex-wrap">
                    {client.structuredProfile.interests.map(interest => (
                      <span key={interest} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Artists */}
              {client.preferredArtists.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs text-gray-500 block mb-2">Preferred Artists</span>
                  <div className="flex gap-2 flex-wrap">
                    {client.preferredArtists.map(artist => (
                      <span key={artist} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Artworks */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Artworks</h3>
              <div className="space-y-3">
                {recommendations.slice(0, 5).map(rec => (
                  <div
                    key={rec.artwork.id}
                    onClick={() => onSelectArtwork(rec.artwork.id)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{rec.artwork.artistName}</h4>
                        <p className="text-sm text-gray-600 italic">{rec.artwork.title}, {rec.artwork.year}</p>
                        <p className="text-sm text-gray-500 mt-1">{rec.artwork.medium}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-gray-900">
                          {formatPrice(rec.artwork.currentAskingPrice || 0)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Match: {Math.round(rec.score)}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{rec.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                <button
                  onClick={() => setIsAddingNote(!isAddingNote)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Note
                </button>
              </div>

              {isAddingNote && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this client... (will be automatically parsed into structured profile)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Save Note
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingNote(false)
                        setNewNote('')
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{client.notes}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="space-y-3">
            {client.purchaseHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No purchases yet</p>
            ) : (
              client.purchaseHistory
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(purchase => {
                  const artwork = getArtworkById(purchase.artworkId)
                  return (
                    <div key={purchase.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{artwork?.artistName || 'Unknown Artist'}</h4>
                          <p className="text-sm text-gray-600 italic">{artwork?.title || 'Unknown Title'}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(purchase.date)}</p>
                          <p className="text-xs text-gray-500">Channel: {purchase.channel}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{formatPrice(purchase.pricePaid)}</div>
                        </div>
                      </div>
                      {purchase.notes && (
                        <p className="text-xs text-gray-600 mt-2">{purchase.notes}</p>
                      )}
                    </div>
                  )
                })
            )}
          </div>
        )}

        {activeTab === 'consignments' && (
          <div className="space-y-3">
            {client.consignmentHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No consignment history</p>
            ) : (
              <>
                {/* Summary */}
                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Consignment Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 block">Successful</span>
                      <span className="text-blue-900 font-semibold">
                        {client.consignmentHistory.filter(c => c.status === 'sold_here').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-orange-700 block">Incomplete/Failed</span>
                      <span className="text-orange-900 font-semibold">
                        {client.consignmentHistory.filter(c =>
                          ['withdrawn', 'expired', 'sale_failed'].includes(c.status)
                        ).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-700 block">Active</span>
                      <span className="text-gray-900 font-semibold">
                        {client.consignmentHistory.filter(c =>
                          ['consigned', 'on_approval', 'on_hold'].includes(c.status)
                        ).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Consignment list */}
                {client.consignmentHistory
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .map(consignment => {
                    const artwork = getArtworkById(consignment.artworkId)
                    return (
                      <div key={consignment.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{artwork?.artistName || 'Unknown'}</h4>
                            <p className="text-sm text-gray-600 italic">{artwork?.title || 'Unknown'}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            getConsignmentStatusColor(consignment.status)
                          }`}>
                            {consignment.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Started: {formatDate(consignment.startDate)}</p>
                          {consignment.endDate && <p>Ended: {formatDate(consignment.endDate)}</p>}
                          <p>Target: {formatPrice(consignment.targetPrice)}</p>
                          {consignment.reservePrice && <p>Reserve: {formatPrice(consignment.reservePrice)}</p>}
                        </div>
                        {consignment.outcomeDetails && (
                          <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                            {consignment.outcomeDetails}
                          </p>
                        )}
                      </div>
                    )
                  })
                }
              </>
            )}
          </div>
        )}

        {activeTab === 'engagements' && (
          <div className="space-y-2">
            {client.digitalEngagements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No engagement history</p>
            ) : (
              client.digitalEngagements
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map(engagement => {
                  const artwork = engagement.artworkId ? getArtworkById(engagement.artworkId) : null
                  return (
                    <div key={engagement.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-900">
                            {engagement.type.replace(/_/g, ' ')}
                          </span>
                          {artwork && (
                            <p className="text-xs text-gray-600 mt-1">
                              {artwork.artistName} - {artwork.title}
                            </p>
                          )}
                          {engagement.metadata?.source && (
                            <p className="text-xs text-gray-500 mt-1">Source: {engagement.metadata.source}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(engagement.timestamp)}
                        </span>
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
