import React, { useState } from 'react';
import { SavedArtwork } from '../../types';
import { sound } from '../../utils/soundEngine';
import { ChevronLeft, Download, Edit3, Trash2, Eye, Paintbrush, Calendar, MapPin, X } from 'lucide-react';

interface ArtworksGalleryViewProps {
  artworks: SavedArtwork[];
  onEditArtwork: (artwork: SavedArtwork) => void;
  onDeleteArtwork: (id: string) => void;
  onNewPainting: () => void;
  onBack: () => void;
}

export const ArtworksGalleryView: React.FC<ArtworksGalleryViewProps> = ({
  artworks,
  onEditArtwork,
  onDeleteArtwork,
  onNewPainting,
  onBack,
}) => {
  const [previewArtwork, setPreviewArtwork] = useState<SavedArtwork | null>(null);

  const handleDownload = (artwork: SavedArtwork) => {
    sound.playClick();
    const link = document.createElement('a');
    link.download = `KalaYatra_${artwork.title.replace(/\s+/g, '_')}.png`;
    link.href = artwork.dataUrl;
    link.click();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-stone-950 text-amber-50 select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-stone-900 border-b border-amber-500/30 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/20 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-amber-400 flex items-center gap-2">
              <Paintbrush size={20} />
              <span>My Sacred Artworks Gallery</span>
            </h2>
            <p className="text-xs text-stone-400">
              Paintings created and preserved during your cultural journeys
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNewPainting();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95"
        >
          <Paintbrush size={14} />
          <span>New Painting</span>
        </button>
      </div>

      {/* Gallery Content */}
      <div className="p-6 max-w-6xl mx-auto w-full flex-1">
        {artworks.length === 0 ? (
          <div className="text-center py-20 bg-stone-900/50 rounded-3xl border border-stone-800 p-8">
            <div className="w-16 h-16 rounded-3xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
              🎨
            </div>
            <h3 className="text-xl font-bold font-heading text-amber-200 mb-2">
              No Artworks Created Yet
            </h3>
            <p className="text-sm text-stone-400 max-w-md mx-auto mb-6">
              Step into the village painting studio, pick up your bamboo brush, and restore your first traditional masterpiece!
            </p>
            <button
              onClick={() => {
                sound.playClick();
                onNewPainting();
              }}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
            >
              Enter Painting Studio Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="bg-stone-900 border-2 border-amber-500/30 hover:border-amber-400 rounded-3xl overflow-hidden shadow-xl transition-all hover:scale-101 flex flex-col justify-between"
              >
                {/* Thumbnail Display */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setPreviewArtwork(art);
                  }}
                  className="relative aspect-[4/3] bg-stone-950 cursor-pointer overflow-hidden border-b border-stone-800 group"
                >
                  <img
                    src={art.dataUrl}
                    alt={art.title}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-amber-300 text-sm font-semibold gap-1.5 backdrop-blur-[2px]">
                    <Eye size={18} />
                    <span>View Fullscreen</span>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <MapPin size={12} />
                      {art.region} • {art.craftName}
                    </span>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {art.createdAt}
                    </span>
                  </div>

                  <h3 className="font-bold text-amber-100 text-base mb-3 truncate">
                    {art.title}
                  </h3>

                  {/* Button Bar */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                    <button
                      onClick={() => handleDownload(art)}
                      className="flex-1 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      title="Download Image"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        onEditArtwork(art);
                      }}
                      className="p-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/30 transition-all"
                      title="Edit Canvas"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        onDeleteArtwork(art.id);
                      }}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-all"
                      title="Delete Artwork"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {previewArtwork && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-stone-900 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => {
                sound.playClick();
                setPreviewArtwork(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold font-heading text-amber-200">
                {previewArtwork.title}
              </h3>
              <p className="text-xs text-stone-400">
                {previewArtwork.craftName} • {previewArtwork.region} • {previewArtwork.createdAt}
              </p>
            </div>

            <div className="bg-stone-950 rounded-2xl overflow-hidden p-2 border border-amber-500/30 mb-6 max-h-[60vh] flex items-center justify-center">
              <img
                src={previewArtwork.dataUrl}
                alt={previewArtwork.title}
                className="max-h-[55vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => handleDownload(previewArtwork)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Download size={14} />
                <span>Download PNG</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onEditArtwork(previewArtwork);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
              >
                <Edit3 size={14} />
                <span>Open in Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
