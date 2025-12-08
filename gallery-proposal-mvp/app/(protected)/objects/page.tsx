import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ObjectsPage() {
  const user = await requireAuth()
  if (!user) redirect('/login')

  // Get objects from mock database
  const objects = db.objects.filter((obj) => obj.galleryId === user.galleryId)

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Objects</h1>
          <p className="text-gray-600 mt-1">Gallery inventory and artworks</p>
        </div>
        <button className="btn btn-primary">+ Add Object</button>
      </div>

      {/* Objects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objects.map((object) => (
          <div key={object.id} className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              {object.imageUrl ? (
                <img src={object.imageUrl} alt={object.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900">{object.title}</h3>
            <p className="text-sm text-gray-600">{object.artist}, {object.year}</p>
            <p className="text-xs text-gray-500 mt-1">{object.medium}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                object.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                object.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
                object.status === 'SOLD' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {object.status}
              </span>
              {object.price && (
                <span className="text-sm font-medium text-gray-900">
                  ${(object.price / 100).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {objects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No objects yet. Add one to get started!</p>
        </div>
      )}
    </div>
  )
}
