import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ClientsPage() {
  const user = await requireAuth()
  if (!user) redirect('/login')

  // Get clients from mock database with counts
  const clients = db.clients
    .filter((client) => client.galleryId === user.galleryId)
    .map((client) => ({
      ...client,
      _count: {
        notes: db.clientNotes.filter((note) => note.clientId === client.id).length,
        dealFlows: db.dealFlows.filter((flow) => flow.clientId === client.id).length,
      },
    }))

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Buyers and consigners</p>
        </div>
        <button className="btn btn-primary">+ Add Client</button>
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
                Interests
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 cursor-pointer">
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
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {client.knownInterests || '—'}
                  </div>
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
  )
}
