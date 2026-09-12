import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, MapPin, Music } from 'lucide-react';
import { Instrument } from '../types.ts';
import { api } from '../services/api.ts';
import { IndiaMap } from '../components/IndiaMap.tsx';
import { InstrumentCard } from '../components/InstrumentCard.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';

export const MapPage: React.FC = () => {
  const [allInstruments, setAllInstruments] = useState<Instrument[]>([]);
  const [selectedState, setSelectedState] = useState<string>('Rajasthan');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getAllInstruments();
        setAllInstruments(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // Compute instrument counts by state
  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allInstruments.forEach((i) => {
      counts[i.state] = (counts[i.state] || 0) + 1;
    });
    return counts;
  }, [allInstruments]);

  // Instruments matching the selected state
  const stateInstruments = useMemo(() => {
    return allInstruments.filter(
      (i) => i.state.toLowerCase() === selectedState.toLowerCase()
    );
  }, [allInstruments, selectedState]);

  // Derive traditions in this state
  const stateTraditions = useMemo(() => {
    const traditions = new Set<string>();
    stateInstruments.forEach((i) => {
      if (i.tradition) traditions.add(i.tradition);
    });
    return Array.from(traditions);
  }, [stateInstruments]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Interactive Cultural Cartography</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          Explore India Through Sound
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Select any state or cultural zone across India to explore the hereditary folk instruments, temple bells, classical ragas, and sacred drums rooted in that soil.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Calibrating cultural sound map..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="space-y-10">
          {/* Interactive Map & Selector Component */}
          <IndiaMap
            selectedState={selectedState}
            onSelectState={(st) => setSelectedState(st)}
            stateCounts={stateCounts}
          />

          {/* Selected State Spotlight Info Banner */}
          <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-700/80">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>State Spotlight</span>
                </div>
                <h2 className="font-serif text-3xl font-bold text-amber-100">
                  {selectedState}
                </h2>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="block text-2xl font-serif font-bold text-amber-300">
                    {stateInstruments.length}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-stone-300">
                    Archived Instruments
                  </span>
                </div>

                <div>
                  <span className="block text-2xl font-serif font-bold text-amber-300">
                    {stateTraditions.length || 1}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-stone-300">
                    Major Traditions
                  </span>
                </div>
              </div>
            </div>

            {/* Traditions Pill Tags */}
            <div className="pt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider mr-2">
                Musical Traditions:
              </span>
              {stateTraditions.length > 0 ? (
                stateTraditions.map((trad) => (
                  <span
                    key={trad}
                    className="px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-medium border border-white/10"
                  >
                    {trad}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-400 italic">
                  Classical & Regional Folk Heritage
                </span>
              )}
            </div>
          </div>

          {/* Instruments from this region */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-800" />
                <span>Instruments of {selectedState}</span>
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                {stateInstruments.length} {stateInstruments.length === 1 ? 'instrument' : 'instruments'} found
              </span>
            </div>

            {stateInstruments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stateInstruments.map((inst) => (
                  <InstrumentCard key={inst.slug} instrument={inst} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-6">
                <p className="text-stone-600 text-sm mb-3">
                  Instruments for {selectedState} are currently being documented by our ethnomusicologists.
                </p>
                <button
                  onClick={() => setSelectedState('Rajasthan')}
                  className="px-4 py-2 rounded-full bg-amber-800 text-white text-xs font-medium hover:bg-amber-900 transition-colors"
                >
                  Explore Rajasthan (Ravanahatha, Kamaicha, Sarangi)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
