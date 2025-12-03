import ArtworkGrid from './ArtworkGrid'
import ProposalPreview from './ProposalPreview'

export default function ScreenPanel({ mode, setMode, selectedIds, onToggleArtwork }) {
  return (
    <div className="flex flex-col h-full">
      {/* Mode Toggle */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('grid')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === 'grid'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Artworks
          </button>
          <button
            onClick={() => setMode('preview')}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === 'preview'
                ? 'bg-primary-500 text-white'
                : selectedIds.length === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Preview ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'grid' ? (
          <ArtworkGrid selectedIds={selectedIds} onToggleArtwork={onToggleArtwork} />
        ) : (
          <ProposalPreview selectedIds={selectedIds} onToggleArtwork={onToggleArtwork} />
        )}
      </div>
    </div>
  )
}
