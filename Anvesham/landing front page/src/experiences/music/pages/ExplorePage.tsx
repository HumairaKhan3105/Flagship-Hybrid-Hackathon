import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Music } from 'lucide-react';
import { Instrument, FilterState } from '../types.ts';
import { api } from '../services/api.ts';
import { SearchBar } from '../components/SearchBar.tsx';
import { FilterPanel } from '../components/FilterPanel.tsx';
import { InstrumentCard } from '../components/InstrumentCard.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';
import { EmptyState } from '../components/EmptyState.tsx';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize filters from query params or defaults
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    state: searchParams.get('state') || 'All',
    family: searchParams.get('family') || 'All',
    region: searchParams.get('region') || 'All',
    sort: (searchParams.get('sort') as any) || 'popular',
  });

  const fetchInstruments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllInstruments({
        search: filters.search,
        state: filters.state,
        family: filters.family,
        region: filters.region,
        sort: filters.sort,
      });
      setInstruments(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments();

    // Sync query params
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.state !== 'All') params.state = filters.state;
    if (filters.family !== 'All') params.family = filters.family;
    if (filters.region !== 'All') params.region = filters.region;
    if (filters.sort !== 'popular') params.sort = filters.sort;
    setSearchParams(params, { replace: true });
  }, [filters.search, filters.state, filters.family, filters.region, filters.sort]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      state: 'All',
      family: 'All',
      region: 'All',
      sort: 'popular',
    });
  };

  // Derive unique states list for filter dropdown
  const availableStates = useMemo(() => {
    const list = [
      'Rajasthan',
      'Punjab',
      'Uttar Pradesh',
      'Tamil Nadu',
      'Karnataka',
      'Kerala',
      'West Bengal',
      'Assam',
      'Jammu & Kashmir',
      'Himachal Pradesh',
      'Uttarakhand',
      'Manipur',
      'Madhya Pradesh',
      'Gujarat',
      'Maharashtra',
      'Odisha',
      'Andhra Pradesh',
      'Telangana',
      'Bihar',
      'Meghalaya',
      'Nagaland',
      'Mizoram',
      'Tripura',
      'Sikkim',
    ];
    return list.sort();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>ItihaasX Musical Archive</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          Explore India's Musical Heritage
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Filter by geographic region, sound family, and classical or folk lineage to uncover the sacred craftsmanship and stories behind India’s instruments.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          value={filters.search}
          onChange={(val) => handleFilterChange({ search: val })}
          placeholder="Search instruments, states or traditions..."
        />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        availableStates={availableStates}
        totalResults={instruments.length}
      />

      {/* Results Section */}
      <div>
        {loading ? (
          <LoadingSpinner message="Searching museum archives..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchInstruments} />
        ) : instruments.length === 0 ? (
          <EmptyState
            title="No matching instruments found"
            description="We couldn't find any instruments matching your criteria. Try adjusting your search keywords or resetting filters."
            actionText="Reset All Filters"
            onActionClick={handleResetFilters}
            icon="search"
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>Showing {instruments.length} authentic instruments</span>
              {filters.family !== 'All' && (
                <span className="font-medium text-amber-900">
                  Family: {filters.family}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {instruments.map((inst) => (
                <InstrumentCard key={inst.slug} instrument={inst} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
