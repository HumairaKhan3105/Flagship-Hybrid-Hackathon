import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Play, Pause, Music2 } from 'lucide-react';
import { Instrument } from '../types.ts';
import { FavoriteButton } from './FavoriteButton.tsx';
import { soundSynthesizer } from '../services/soundSynthesizer.ts';
import { getFallbackForInstrument } from '../utils/imageFallback.ts';

interface InstrumentCardProps {
  instrument: Instrument;
}

export const InstrumentCard: React.FC<InstrumentCardProps> = ({ instrument }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImgSrc, setCurrentImgSrc] = useState<string>(instrument.imageUrl);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleQuickListen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    soundSynthesizer.playCulturalRagaPreview(instrument.family, instrument.audioNote);

    setTimeout(() => {
      setIsPlaying(false);
    }, 2800);
  };

  const familyColors: Record<string, string> = {
    String: 'bg-amber-100 text-amber-900 border-amber-300',
    Wind: 'bg-sky-100 text-sky-900 border-sky-300',
    Percussion: 'bg-orange-100 text-orange-900 border-orange-300',
    Folk: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    Classical: 'bg-purple-100 text-purple-900 border-purple-300',
    Tribal: 'bg-rose-100 text-rose-900 border-rose-300',
    'Keyboard / other': 'bg-stone-100 text-stone-800 border-stone-300',
  };

  const badgeColor = familyColors[instrument.family] || 'bg-amber-100 text-amber-900 border-amber-300';

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-amber-400/70 transition-all duration-300 overflow-hidden relative">
      {/* Top Image Area */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
        {!imgError ? (
          <img
            src={currentImgSrc}
            alt={`${instrument.name} traditional musical instrument`}
            loading="lazy"
            onError={() => {
              if (!hasTriedFallback) {
                setHasTriedFallback(true);
                setCurrentImgSrc(getFallbackForInstrument(instrument.slug, instrument.family));
              } else {
                setImgError(true);
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50/70 text-amber-800">
            <Music2 className="w-10 h-10 mb-1 opacity-70" />
            <span className="text-xs font-serif font-medium">{instrument.name}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-80 transition-opacity" />

        {/* Favorite Button at Top-Right */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton slug={instrument.slug} name={instrument.name} size="sm" />
        </div>

        {/* Family Badge at Top-Left */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-xs shadow-xs ${badgeColor}`}
          >
            {instrument.family}
          </span>
        </div>

        {/* State / Region Pill at Bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
          <span className="inline-flex items-center gap-1 font-medium drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{instrument.state}</span>
          </span>
          <span className="text-[11px] text-stone-200 drop-shadow-md font-sans">
            {instrument.region}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
              <Link to={`/instruments/${instrument.slug}`} className="hover:underline">
                {instrument.name}
              </Link>
            </h3>
            {instrument.alternativeNames?.length > 0 && (
              <span className="text-xs text-stone-500 font-sans truncate max-w-[110px]" title={instrument.alternativeNames[0]}>
                {instrument.alternativeNames[0]}
              </span>
            )}
          </div>

          <p className="text-xs font-medium text-amber-800 mb-2.5">
            {instrument.tradition}
          </p>

          <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed mb-4">
            {instrument.description}
          </p>
        </div>

        {/* Bottom Action Buttons */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Quick Listen Button */}
          <button
            onClick={handleQuickListen}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
            title={`Listen to ${instrument.name}`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Playing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Explore Button */}
          <Link
            to={`/instruments/${instrument.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-amber-900 group/btn"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
