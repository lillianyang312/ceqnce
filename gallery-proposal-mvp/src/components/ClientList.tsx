/**
 * ClientList Component
 *
 * Displays a table/list of all clients with filtering capabilities
 */

import React, { useState, useMemo } from 'react'
import type { Client } from '../types'

interface ClientListProps {
  clients: Client[]
  onSelectClient: (clientId: string) => void
  selectedClientId?: string
}

export default function ClientList({
  clients,
  onSelectClient,
  selectedClientId
}: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter clients based on search and status
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === 'all' ||
        client.structuredProfile.relationshipStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [clients, searchTerm, statusFilter])

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get status badge color
  const getStatusColor = (status: Client['structuredProfile']['relationshipStatus']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'VIP': return 'bg-purple-100 text-purple-800'
      case 'prospect': return 'bg-blue-100 text-blue-800'
      case 'dormant': return 'bg-gray-100 text-gray-800'
      case 'institution': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Clients</h2>
        <p className="text-sm text-gray-500 mt-1">
          {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'}
        </p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'VIP', 'prospect', 'institution', 'dormant'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Client list */}
      <div className="flex-1 overflow-y-auto">
        {filteredClients.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No clients found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredClients.map(client => (
              <div
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={`px-6 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedClientId === client.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Name and location */}
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {client.name}
                      </h3>
                      {client.tags.includes('VIP') && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          VIP
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mb-2">{client.location}</p>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        getStatusColor(client.structuredProfile.relationshipStatus)
                      }`}>
                        {client.structuredProfile.relationshipStatus}
                      </span>

                      {client.tags.filter(t => t !== 'VIP').slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="ml-4 text-right">
                    <div className="text-xs text-gray-500">
                      {client.purchaseHistory.length} purchase{client.purchaseHistory.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Last: {formatDate(client.lastContactDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
