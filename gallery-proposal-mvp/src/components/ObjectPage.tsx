import { useState } from 'react'
import { ObjectWork } from '../types/auctionHouse'
import { useSpecialist } from '../contexts/SpecialistContext'
import { objects } from '../data/auctionMockData'
import {
  getLikelyBuyersForObject,
  getFollowUpClientsForObject
} from '../services/aiLogic'

interface ObjectPageProps {
  onSendToChat: (message: string) => void
}

export default function ObjectPage({ onSendToChat }: ObjectPageProps) {
  const { activeSpecialist } = useSpecialist()
  const [activeTab, setActiveTab] = useState<'on-sale' | 'known-works'>('on-sale')
  const [selectedObject, setSelectedObject] = useState<ObjectWork | null>(null)

  // Filter objects by specialist and sale status
  const onSaleObjects = objects.filter(
    o => o.primarySpecialistId === activeSpecialist?.id && o.isBeingSoldNow
  )
  const knownWorksObjects = objects.filter(
    o => o.primarySpecialistId === activeSpecialist?.id && o.isKnownWork && !o.isBeingSoldNow
  )

  const displayObjects = activeTab === 'on-sale' ? onSaleObjects : knownWorksObjects

  const handleObjectClick = (object: ObjectWork) => {
    setSelectedObject(object)
  }

  const handleCloseDetail = () => {
    setSelectedObject(null)
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          <button
            onClick={() => {
              setActiveTab('on-sale')
              setSelectedObject(null)
            }}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'on-sale'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            On Sale ({onSaleObjects.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('known-works')
              setSelectedObject(null)
            }}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'known-works'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Known Works ({knownWorksObjects.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Object List */}
        <div className={`${selectedObject ? 'w-1/2' : 'w-full'} overflow-y-auto border-r border-gray-200 bg-gray-50`}>
          {displayObjects.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-sm">No {activeTab === 'on-sale' ? 'objects on sale' : 'known works'} found</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {displayObjects.map(object => (
                <button
                  key={object.id}
                  onClick={() => handleObjectClick(object)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedObject?.id === object.id
                      ? 'bg-primary-50 border-primary-200'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                      Image
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{object.title}</h3>
                      <p className="text-sm text-gray-600">{object.artist}, {object.year}</p>
                      <p className="text-xs text-gray-500 mt-1">{object.medium}</p>
                      {activeTab === 'on-sale' ? (
                        <p className="text-sm font-medium text-primary-600 mt-2">
                          Est. {formatPrice(object.estimateLow, object.currency)} - {formatPrice(object.estimateHigh, object.currency)}
                        </p>
                      ) : (
                        object.lastSoldPrice && (
                          <p className="text-sm text-gray-600 mt-2">
                            Last sold: {formatPrice(object.lastSoldPrice, object.currency)} ({object.lastSoldDate})
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Object Detail Panel */}
        {selectedObject && (
          <div className="w-1/2 overflow-y-auto bg-white">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedObject.title}</h2>
                  <p className="text-lg text-gray-600 mt-1">{selectedObject.artist}, {selectedObject.year}</p>
                </div>
                <button
                  onClick={handleCloseDetail}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Image placeholder */}
              <div className="w-full h-64 bg-gray-200 rounded-lg mb-6 flex items-center justify-center text-gray-500">
                Object Image
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Medium</h3>
                  <p className="text-gray-900">{selectedObject.medium}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Dimensions</h3>
                  <p className="text-gray-900">{selectedObject.dimensions}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Condition</h3>
                  <p className="text-gray-900">{selectedObject.condition}</p>
                </div>
                {selectedObject.isBeingSoldNow && (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Estimate</h3>
                      <p className="text-gray-900">
                        {formatPrice(selectedObject.estimateLow, selectedObject.currency)} - {formatPrice(selectedObject.estimateHigh, selectedObject.currency)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Sale</h3>
                      <p className="text-gray-900">{selectedObject.saleName}</p>
                      <p className="text-sm text-gray-600">{selectedObject.saleDate} • Lot {selectedObject.lotNumber}</p>
                    </div>
                  </>
                )}
                {selectedObject.provenance && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Provenance</h3>
                    <p className="text-gray-900">{selectedObject.provenance}</p>
                  </div>
                )}
                {selectedObject.exhibited && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Exhibited</h3>
                    <p className="text-gray-900">{selectedObject.exhibited}</p>
                  </div>
                )}
                {selectedObject.literature && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Literature</h3>
                    <p className="text-gray-900">{selectedObject.literature}</p>
                  </div>
                )}
              </div>

              {/* Follow-up Clients Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Potential Buyers</h3>
                <FollowUpClientsList objectId={selectedObject.id} onSendToChat={onSendToChat} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Follow-up Clients List Component
function FollowUpClientsList({ objectId, onSendToChat }: { objectId: string; onSendToChat: (message: string) => void }) {
  const followUps = getFollowUpClientsForObject(objectId)

  if (followUps.length === 0) {
    return <p className="text-sm text-gray-500">No potential buyers identified yet.</p>
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  }

  return (
    <div className="space-y-3">
      {followUps.slice(0, 5).map((followUp, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{followUp.client.name}</h4>
              <p className="text-xs text-gray-500">{followUp.client.location}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded border ${priorityColors[followUp.priority]}`}>
              {followUp.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{followUp.reason}</p>
          <p className="text-xs text-gray-700 mb-3">
            <span className="font-medium">Action:</span> {followUp.suggestedAction}
          </p>
          <button
            onClick={() => onSendToChat(`Tell me more about ${followUp.client.name}`)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Ask Ceqnce about this client →
          </button>
        </div>
      ))}
    </div>
  )
}
