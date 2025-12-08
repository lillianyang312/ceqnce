'use client'

import { useState } from 'react'

type Object = {
  id: string
  title: string
  artist: string
  year: number | null
  medium: string
  dimensions: string | null
  location: string | null
  price: number | null
  status: string
  imageUrl: string | null
  metadataJson: any
}

export default function ObjectsClient({ objects }: { objects: Object[] }) {
  const [selectedObject, setSelectedObject] = useState<Object | null>(null)

  return (
    <div className="p-8 flex gap-6">
      {/* Objects Grid */}
      <div className={selectedObject ? "w-2/3" : "w-full"}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Objects</h1>
            <p className="text-gray-600 mt-1">Gallery inventory and artworks</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Add Object
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objects.map((object) => (
            <div
              key={object.id}
              onClick={() => setSelectedObject(object)}
              className={`card hover:shadow-md transition-shadow cursor-pointer ${
                selectedObject?.id === object.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                {object.imageUrl ? (
                  <img
                    src={object.imageUrl}
                    alt={object.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900">{object.title}</h3>
              <p className="text-sm text-gray-600">
                {object.artist}, {object.year}
              </p>
              <p className="text-xs text-gray-500 mt-1">{object.medium}</p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    object.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : object.status === 'ON_HOLD'
                      ? 'bg-yellow-100 text-yellow-800'
                      : object.status === 'SOLD'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
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

      {/* Detail Panel */}
      {selectedObject && (
        <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 max-h-[calc(100vh-200px)] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Object Details</h2>
            <button
              onClick={() => setSelectedObject(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Image */}
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              {selectedObject.imageUrl ? (
                <img
                  src={selectedObject.imageUrl}
                  alt={selectedObject.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>

            {/* Basic Info */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedObject.title}
              </h3>
              <p className="text-gray-600">
                {selectedObject.artist}, {selectedObject.year}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Medium:</span>
                <span className="font-medium text-gray-900">{selectedObject.medium}</span>
              </div>
              {selectedObject.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium text-gray-900">
                    {selectedObject.dimensions}
                  </span>
                </div>
              )}
              {selectedObject.location && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-gray-900">{selectedObject.location}</span>
                </div>
              )}
              {selectedObject.price && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-gray-900">
                    ${(selectedObject.price / 100).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    selectedObject.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : selectedObject.status === 'ON_HOLD'
                      ? 'bg-yellow-100 text-yellow-800'
                      : selectedObject.status === 'SOLD'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedObject.status}
                </span>
              </div>
            </div>

            {/* Metadata */}
            {selectedObject.metadataJson && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">Additional Info</h4>
                <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-auto">
                  {JSON.stringify(selectedObject.metadataJson, null, 2)}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Start Sale Flow
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Edit Object
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
