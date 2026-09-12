import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Trash2 } from 'lucide-react';
import { Instrument } from '../types.ts';
import { api } from '../services/api.ts';
import { useFavorites } from '../hooks/useFavorites.ts';
import { InstrumentCard } from '../components/InstrumentCard.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavs = async () => {
      setLoading(true);
      try {
        const all = await api.getAllInstruments();
        const favItems = all.filter((i) => favorites.includes(i.slug));
        setInstruments(favItems);
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    };
    loadFavs();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-red-600 stroke-red-600" />
          <span>Personal Cultural Collection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          Your Saved Instruments
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Revisit the instruments you love, their acoustics, and regional stories at any time.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving your saved treasures..." />
      ) : instruments.length === 0 ? (
        <EmptyState
          title="Your cultural collection is empty"
          description="You haven't saved any instruments yet. Browse through our collection and click the heart icon on any instrument to save it here."
          actionText="Explore Instruments"
          actionLink="/instruments"
          icon="music"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1 border-b border-stone-200 pb-3">
            <span>
              {instruments.length} {instruments.length === 1 ? 'saved instrument' : 'saved instruments'}
            </span>
            <span className="italic">Saved in your local browser session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {instruments.map((inst) => (
              <InstrumentCard key={inst.slug} instrument={inst} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
