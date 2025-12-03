import { artworks } from '../data/mockData'

export default function ArtworkGrid({ selectedIds, onToggleArtwork }) {
  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      {artworks.map(artwork => {
        const isSelected = selectedIds.includes(artwork.id)
        return (
          <div
            key={artwork.id}
            onClick={() => onToggleArtwork(artwork.id)}
            className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            {/* Image */}
            <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="font-medium text-gray-900 text-sm truncate">{artwork.artist}</p>
              <p className="text-xs text-gray-500 truncate italic">{artwork.title}</p>
              <p className="text-xs font-medium text-primary-500 mt-2">{artwork.priceFormatted}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
