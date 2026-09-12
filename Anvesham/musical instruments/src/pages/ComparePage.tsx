import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Scale, ArrowLeftRight, Sparkles, MapPin, Volume2, ArrowRight } from 'lucide-react';
import { Instrument } from '../types.ts';
import { api } from '../services/api.ts';
import { AudioPlayer } from '../components/AudioPlayer.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';

export const ComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allInstruments, setAllInstruments] = useState<Instrument[]>([]);
  const [instrumentA, setInstrumentA] = useState<Instrument | null>(null);
  const [instrumentB, setInstrumentB] = useState<Instrument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getAllInstruments();
        setAllInstruments(data);

        // Check query params or pick default pair
        const slugA = searchParams.get('a') || 'sitar';
        const slugB = searchParams.get('b') || 'saraswati-veena';

        const itemA = data.find((i) => i.slug === slugA) || data[0];
        const itemB = data.find((i) => i.slug === slugB) || data[1] || data[0];

        setInstrumentA(itemA);
        setInstrumentB(itemB);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelectA = (slug: string) => {
    const found = allInstruments.find((i) => i.slug === slug) || null;
    setInstrumentA(found);
    if (found && instrumentB) {
      setSearchParams({ a: found.slug, b: instrumentB.slug });
    }
  };

  const handleSelectB = (slug: string) => {
    const found = allInstruments.find((i) => i.slug === slug) || null;
    setInstrumentB(found);
    if (instrumentA && found) {
      setSearchParams({ a: instrumentA.slug, b: found.slug });
    }
  };

  const handleSwap = () => {
    const temp = instrumentA;
    setInstrumentA(instrumentB);
    setInstrumentB(temp);
    if (instrumentB && temp) {
      setSearchParams({ a: instrumentB.slug, b: temp.slug });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading instrument comparison vault..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const comparisonFields = [
    {
      label: 'Instrument Family',
      renderA: instrumentA?.family,
      renderB: instrumentB?.family,
    },
    {
      label: 'Region / Zone',
      renderA: instrumentA?.region,
      renderB: instrumentB?.region,
    },
    {
      label: 'State of Origin',
      renderA: instrumentA?.state,
      renderB: instrumentB?.state,
    },
    {
      label: 'Musical Lineage',
      renderA: instrumentA?.tradition,
      renderB: instrumentB?.tradition,
    },
    {
      label: 'Historical Origin',
      renderA: instrumentA?.origin,
      renderB: instrumentB?.origin,
    },
    {
      label: 'Crafting Materials',
      renderA: instrumentA?.materials?.join(', '),
      renderB: instrumentB?.materials?.join(', '),
    },
    {
      label: 'Playing Technique',
      renderA: instrumentA?.howItIsPlayed,
      renderB: instrumentB?.howItIsPlayed,
    },
    {
      label: 'Cultural & Sacred Use',
      renderA: instrumentA?.culturalUses?.join(' • '),
      renderB: instrumentB?.culturalUses?.join(' • '),
    },
    {
      label: 'Associated Communities',
      renderA: instrumentA?.community,
      renderB: instrumentB?.community,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5 text-amber-700" />
          <span>Organological Analysis</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          Compare Traditional Instruments
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Select two Indian musical instruments side by side to discover shared lineages, contrasting acoustic physics, crafting materials, and sacred roles.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Instrument A Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
              Select First Instrument
            </label>
            <select
              value={instrumentA?.slug || ''}
              onChange={(e) => handleSelectA(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-serif font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
            >
              {allInstruments.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name} ({i.state} • {i.family})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors shadow-xs cursor-pointer"
              title="Swap Instruments"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Instrument B Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
              Select Second Instrument
            </label>
            <select
              value={instrumentB?.slug || ''}
              onChange={(e) => handleSelectB(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-serif font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
            >
              {allInstruments.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name} ({i.state} • {i.family})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Overview Cards */}
      {instrumentA && instrumentB && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={instrumentA.imageUrl}
                alt={instrumentA.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-900 text-white shadow-xs">
                {instrumentA.family}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {instrumentA.name}
              </h2>
              <span className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>{instrumentA.state} • {instrumentA.region}</span>
              </span>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed line-clamp-3">
                {instrumentA.description}
              </p>
            </div>

            {/* Audio Preview */}
            <div className="pt-2">
              <AudioPlayer
                audioUrl={instrumentA.audioUrl}
                instrumentName={instrumentA.name}
                family={instrumentA.family}
                audioNote={instrumentA.audioNote}
              />
            </div>

            <div className="pt-2 text-right">
              <Link
                to={`/instruments/${instrumentA.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950"
              >
                <span>Read Complete {instrumentA.name} Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={instrumentB.imageUrl}
                alt={instrumentB.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-900 text-white shadow-xs">
                {instrumentB.family}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {instrumentB.name}
              </h2>
              <span className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>{instrumentB.state} • {instrumentB.region}</span>
              </span>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed line-clamp-3">
                {instrumentB.description}
              </p>
            </div>

            {/* Audio Preview */}
            <div className="pt-2">
              <AudioPlayer
                audioUrl={instrumentB.audioUrl}
                instrumentName={instrumentB.name}
                family={instrumentB.family}
                audioNote={instrumentB.audioNote}
              />
            </div>

            <div className="pt-2 text-right">
              <Link
                to={`/instruments/${instrumentB.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950"
              >
                <span>Read Complete {instrumentB.name} Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {instrumentA && instrumentB && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="p-6 bg-amber-50/70 border-b border-amber-200/80">
            <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Side-by-Side Heritage Matrix</span>
            </h3>
          </div>

          <div className="divide-y divide-stone-100">
            {comparisonFields.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 sm:p-6 hover:bg-stone-50/60 transition-colors"
              >
                <div className="md:col-span-3 text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center">
                  {row.label}
                </div>

                <div className="md:col-span-4 text-sm text-stone-800 leading-relaxed font-normal">
                  <span className="md:hidden text-xs font-semibold text-stone-400 block mb-1">
                    {instrumentA.name}:
                  </span>
                  {row.renderA || '—'}
                </div>

                <div className="hidden md:block md:col-span-1 text-center text-stone-300 font-serif">
                  vs
                </div>

                <div className="md:col-span-4 text-sm text-stone-800 leading-relaxed font-normal">
                  <span className="md:hidden text-xs font-semibold text-stone-400 block mb-1">
                    {instrumentB.name}:
                  </span>
                  {row.renderB || '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
