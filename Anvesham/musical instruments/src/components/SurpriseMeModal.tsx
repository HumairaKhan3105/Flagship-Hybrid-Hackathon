import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Volume2, ArrowRight, RotateCw, MapPin } from 'lucide-react';
import { Instrument } from '../types.ts';
import { api } from '../services/api.ts';
import { soundSynthesizer } from '../services/soundSynthesizer.ts';

interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const fetchRandom = async () => {
    setLoading(true);
    setIsPlayingAudio(false);
    try {
      const rand = await api.getRandomInstrument();
      setInstrument(rand);
    } catch (e) {
      console.error('Failed to get random instrument', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchRandom();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleListen = () => {
    if (!instrument) return;
    setIsPlayingAudio(true);
    soundSynthesizer.playCulturalRagaPreview(instrument.family, instrument.audioNote);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2800);
  };

  const handleLearnStory = () => {
    if (!instrument) return;
    onClose();
    navigate(`/instruments/${instrument.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden text-stone-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
            <div className="w-14 h-14 rounded-full border-4 border-amber-800 border-t-transparent animate-spin mb-4"></div>
            <p className="font-serif text-lg font-bold text-amber-950">
              Spinning the Wheel of Sangeet...
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Selecting a rare cultural treasure from India’s musical archives
            </p>
          </div>
        ) : instrument ? (
          <div>
            {/* Top Image Banner */}
            <div className="relative h-56 w-full overflow-hidden bg-stone-100">
              <img
                src={instrument.imageUrl}
                alt={instrument.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/90 text-white text-xs font-semibold backdrop-blur-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>You discovered...</span>
              </div>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="inline-flex items-center gap-1 text-xs text-amber-300 font-medium mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{instrument.state} • {instrument.region}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide">
                  {instrument.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="inline-block px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                {instrument.family} Family • {instrument.tradition}
              </div>

              {/* Cultural Fact */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Cultural Fact
                </span>
                <p className="text-sm text-stone-700 leading-relaxed italic">
                  "{instrument.interestingFacts?.[0] || instrument.description}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleListen}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all cursor-pointer shadow-sm ${
                    isPlayingAudio
                      ? 'bg-amber-800 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300/80'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? 'Sound Playing...' : 'Listen to it'}</span>
                </button>

                <button
                  onClick={handleLearnStory}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
                >
                  <span>Learn its story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Surprise another */}
              <div className="text-center pt-1">
                <button
                  onClick={fetchRandom}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Spin Again for Another Instrument</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
