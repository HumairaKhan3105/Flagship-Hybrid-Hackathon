import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  MapPin,
  Sparkles,
  Hammer,
  History,
  Users,
  Calendar,
  Layers,
  ArrowLeft,
  Volume2,
  Lightbulb,
} from 'lucide-react';
import { Instrument } from '../types.ts';
import { api } from '../services/api.ts';
import { AudioPlayer } from '../components/AudioPlayer.tsx';
import { FavoriteButton } from '../components/FavoriteButton.tsx';
import { InstrumentCard } from '../components/InstrumentCard.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';
import { getFallbackForInstrument } from '../utils/imageFallback.ts';

export const InstrumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [related, setRelated] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadInstrument = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getInstrumentById(id);
        setInstrument(data);

        // Fetch related instruments (by family or state)
        if (data) {
          const all = await api.getAllInstruments({ family: data.family });
          const filtered = all
            .filter((i) => i.slug !== data.slug)
            .slice(0, 4);
          setRelated(filtered);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadInstrument();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Opening instrument museum gallery..." />;
  }

  if (error || !instrument) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorMessage
          title="Instrument Not Found"
          message="We could not locate this instrument in our cultural archives."
          onRetry={() => navigate('/instruments')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-amber-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link to="/instruments" className="hover:text-amber-900 transition-colors">
          Instruments
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-amber-950 font-semibold">{instrument.name}</span>
      </nav>

      {/* 2. TOP HERO CARD: IMAGE & KEY ATTRIBUTES & AUDIO PLAYER */}
      <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Large Image View */}
          <div className="lg:col-span-6 relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-900 shadow-md">
            <img
              src={instrument.imageUrl}
              alt={`${instrument.name} traditional musical instrument`}
              onError={(e) => {
                const target = e.currentTarget;
                const fallback = getFallbackForInstrument(instrument.slug, instrument.family);
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-4 right-4 z-10">
              <FavoriteButton slug={instrument.slug} name={instrument.name} size="md" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xs border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{instrument.state}, {instrument.region}</span>
              </span>

              <span className="text-xs text-amber-200 font-serif font-medium">
                {instrument.tradition}
              </span>
            </div>
          </div>

          {/* Key Attributes & Audio */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Badge row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  {instrument.family} Family
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                  {instrument.region}
                </span>
              </div>

              {/* Title & Local Names */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 tracking-tight mb-2">
                {instrument.name}
              </h1>

              {instrument.alternativeNames && instrument.alternativeNames.length > 0 && (
                <p className="text-xs text-stone-500 font-sans mb-4">
                  <span className="font-semibold text-stone-700">Alternative / Local Names: </span>
                  {instrument.alternativeNames.join(', ')}
                </p>
              )}

              <p className="text-stone-700 text-base leading-relaxed mb-4">
                {instrument.description}
              </p>

              {/* Materials Pill Badges */}
              {instrument.materials && instrument.materials.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                    Crafting Materials
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {instrument.materials.map((mat) => (
                      <span
                        key={mat}
                        className="px-2.5 py-1 rounded-lg text-xs bg-stone-50 text-stone-700 border border-stone-200/90 font-medium"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Audio Player */}
            <div className="pt-4 border-t border-stone-100">
              <AudioPlayer
                audioUrl={instrument.audioUrl}
                instrumentName={instrument.name}
                family={instrument.family}
                audioNote={instrument.audioNote}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. STORY SECTION: “The Story Behind the Sound” */}
      <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="border-b border-stone-100 pb-4">
          <div className="inline-flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Oral & Recorded Lore</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-950">
            The Story Behind the Sound
          </h2>
        </div>

        {/* Structured Story Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Origin & Lore */}
          <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-base">
              <History className="w-5 h-5 text-amber-800" />
              <span>Origin & Lineage</span>
            </div>
            <p className="text-stone-700 text-sm leading-relaxed">
              {instrument.origin}
            </p>
          </div>

          {/* Historical Evolution */}
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
              <Layers className="w-5 h-5 text-amber-800" />
              <span>Historical Evolution</span>
            </div>
            <p className="text-stone-700 text-sm leading-relaxed">
              {instrument.history}
            </p>
          </div>

          {/* Construction & Crafting */}
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
              <Hammer className="w-5 h-5 text-amber-800" />
              <span>How It Is Made</span>
            </div>
            <p className="text-stone-700 text-sm leading-relaxed">
              {instrument.construction}
            </p>
          </div>

          {/* How It Is Played */}
          <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-base">
              <Volume2 className="w-5 h-5 text-amber-800" />
              <span>Playing Technique</span>
            </div>
            <p className="text-stone-700 text-sm leading-relaxed">
              {instrument.howItIsPlayed}
            </p>
          </div>
        </div>

        {/* Community & Tradition */}
        <div className="p-6 rounded-2xl bg-stone-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Hereditary Keepers & Communities</span>
            </div>
            <p className="text-base text-stone-200 font-medium">
              {instrument.community}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={`/instruments?search=${encodeURIComponent(instrument.state)}`}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-amber-200 transition-colors"
            >
              Explore {instrument.state} Lineage
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CULTURAL CONNECTION: “Where You Hear It” */}
      <section className="bg-gradient-to-br from-[#FDFBF7] via-amber-50/40 to-stone-100/60 rounded-3xl border border-amber-200/90 p-6 sm:p-10 space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-800 block mb-1">
            Living Cultural Context
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-950">
            Where You Hear It
          </h2>
          <p className="text-stone-600 text-sm mt-1 max-w-xl">
            In Indian traditions, instruments are never detached from daily life, spiritual communion, and seasonal rhythms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {instrument.culturalUses.map((use, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-stone-800">
                {use}
              </span>
            </div>
          ))}
        </div>

        {/* Festivals & Occasions */}
        {instrument.festivals && instrument.festivals.length > 0 && (
          <div className="pt-4 border-t border-amber-200/70">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Festivals & Sacred Celebrations</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {instrument.festivals.map((fest) => (
                <span
                  key={fest}
                  className="px-3 py-1.5 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 text-xs font-medium"
                >
                  {fest}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5. DID YOU KNOW? (3–5 FACT CARDS) */}
      {instrument.interestingFacts && instrument.interestingFacts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-300" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Did You Know?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {instrument.interestingFacts.map((fact, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                <span className="text-xs font-serif font-bold text-amber-800 mb-2 block">
                  Heritage Insight #{idx + 1}
                </span>
                <p className="text-stone-700 text-sm leading-relaxed italic">
                  "{fact}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. RELATED INSTRUMENTS */}
      {related.length > 0 && (
        <section className="pt-8 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Explore Related {instrument.family} Instruments
            </h3>
            <Link
              to={`/instruments?family=${instrument.family}`}
              className="text-xs font-semibold text-amber-800 hover:underline"
            >
              View all {instrument.family}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((inst) => (
              <InstrumentCard key={inst.slug} instrument={inst} />
            ))}
          </div>
        </section>
      )}

      {/* Back button */}
      <div className="pt-4 text-center">
        <Link
          to="/instruments"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complete Collection</span>
        </Link>
      </div>
    </div>
  );
};
