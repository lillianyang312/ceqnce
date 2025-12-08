'use client'

import { useState } from 'react'

type Client = {
  id: string
  name: string
  email: string | null
  phone: string | null
  typeTags: string
  knownInterests: string | null
  digitalEngagementJson: any
  pastBuyingEngagementJson: any
  _count: {
    notes: number
    dealFlows: number
  }
}

export default function ClientsClient({ clients }: { clients: Client[] }) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  return (
    <div className="p-8 flex gap-6">
      {/* Clients List */}
      <div className={selectedClient ? "w-2/3" : "w-full"}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Buyers and consigners</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Add Client
          </button>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedClient?.id === client.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.typeTags.split(',').map((tag) => (
                      <span
                        key={tag}
                        className="inline-block mr-1 px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.email || '—'}</div>
                    <div className="text-sm text-gray-500">{client.phone || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client._count.dealFlows} deals, {client._count.notes} notes
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {clients.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No clients yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedClient && (
        <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 max-h-[calc(100vh-200px)] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
            <button
              onClick={() => setSelectedClient(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedClient.name}</h3>
              <div className="mt-2 space-y-1 text-sm">
                {selectedClient.email && (
                  <div className="text-gray-600">{selectedClient.email}</div>
                )}
                {selectedClient.phone && (
                  <div className="text-gray-600">{selectedClient.phone}</div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Type</h4>
              <div className="flex gap-2">
                {selectedClient.typeTags.split(',').map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            {selectedClient.knownInterests && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Known Interests</h4>
                <p className="text-sm text-gray-600">{selectedClient.knownInterests}</p>
              </div>
            )}

            {/* Digital Engagement */}
            {selectedClient.digitalEngagementJson && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">Digital Engagement</h4>
                <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-auto">
                  {JSON.stringify(selectedClient.digitalEngagementJson, null, 2)}
                </pre>
              </div>
            )}

            {/* Past Buying */}
            {selectedClient.pastBuyingEngagementJson && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">Past Buying Engagement</h4>
                <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-auto">
                  {JSON.stringify(selectedClient.pastBuyingEngagementJson, null, 2)}
                </pre>
              </div>
            )}

            {/* Activity */}
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-2">Activity</h4>
              <div className="text-sm text-gray-600">
                <div>{selectedClient._count.dealFlows} active deal flows</div>
                <div>{selectedClient._count.notes} notes</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Deal Flow
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Add Note
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Edit Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
