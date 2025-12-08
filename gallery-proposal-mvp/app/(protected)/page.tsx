import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DealFlowPage() {
  const user = await requireAuth()
  if (!user) redirect('/login')

  // Get deal flows with related data from mock database
  const dealFlows = db.dealFlows
    .filter((flow) => flow.galleryId === user.galleryId)
    .map((flow) => ({
      ...flow,
      client: db.clients.find((c) => c.id === flow.clientId) || null,
      object: db.objects.find((o) => o.id === flow.objectId) || null,
    }))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deal Flow</h1>
          <p className="text-gray-600 mt-1">Manage sales, requests, and consignments</p>
        </div>
        <button className="btn btn-primary">+ New Deal Flow</button>
      </div>

      {/* Deal Flows Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Object
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dealFlows.map((flow) => (
              <tr key={flow.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    flow.type === 'OBJECT_SALE' ? 'bg-blue-100 text-blue-800' :
                    flow.type === 'CLIENT_REQUEST' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {flow.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{flow.title}</div>
                  {flow.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {flow.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {flow.client?.name || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {flow.object ? `${flow.object.title} by ${flow.object.artist}` : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                    {flow.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(flow.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {dealFlows.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No deal flows yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
