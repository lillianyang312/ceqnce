import { useState } from 'react'
import { artworks } from '../data/mockData'
import { formatPriceFull } from '../utils/formatters'
import { generateProposalPDF } from '../utils/exportPDF'

export default function ProposalPreview({ selectedIds, onToggleArtwork }) {
  const [isExporting, setIsExporting] = useState(false)

  const selectedWorks = artworks.filter(a => selectedIds.includes(a.id))
  const totalValue = selectedWorks.reduce((sum, a) => sum + a.price, 0)
  const primaryCount = selectedWorks.filter(a => a.market === 'Primary').length
  const secondaryCount = selectedWorks.filter(a => a.market === 'Secondary').length

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await generateProposalPDF(selectedIds)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF')
    }
    setIsExporting(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Summary Stats */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Works</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{selectedWorks.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Market</p>
            <p className="text-sm text-gray-700 mt-1">
              {primaryCount} Primary • {secondaryCount} Secondary
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Value</p>
            <p className="text-2xl font-bold text-primary-500 mt-1">{formatPriceFull(totalValue)}</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {isExporting ? 'Generating PDF...' : 'Export PDF Proposal'}
        </button>
      </div>

      {/* Selected Artworks */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {selectedWorks.map((artwork, index) => (
          <div
            key={artwork.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex gap-4 p-4">
              {/* Image */}
              <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{artwork.artist}</p>
                    <p className="text-sm text-gray-500 italic">{artwork.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{artwork.year}</p>
                  </div>
                  <button
                    onClick={() => onToggleArtwork(artwork.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 mt-1"
                    title="Remove from proposal"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between items-end mt-3">
                  <p className="text-xs text-gray-500">
                    {artwork.market} • {artwork.medium}
                  </p>
                  <p className="font-medium text-primary-500">{artwork.priceFormatted}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Total at bottom */}
        <div className="bg-gradient-to-b from-white to-transparent pt-4 mt-6 border-t-2 border-gray-200">
          <div className="flex justify-between items-center">
            <p className="font-bold text-gray-900">Total Proposal Value</p>
            <p className="text-xl font-bold text-primary-500">{formatPriceFull(totalValue)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
