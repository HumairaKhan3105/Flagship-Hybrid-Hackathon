import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterState, SortOption } from '../types.ts';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  availableStates: string[];
  totalResults: number;
}

const FAMILIES = [
  'All',
  'String',
  'Wind',
  'Percussion',
  'Folk',
  'Classical',
  'Tribal',
  'Keyboard / other',
];

const REGIONS = [
  'All',
  'North India',
  'South India',
  'East India',
  'West India',
  'Northeast India',
  'Central India',
  'Himalayan',
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'A – Z', value: 'a-z' },
  { label: 'By State/Region', value: 'region' },
  { label: 'Recently Added', value: 'recent' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableStates,
  totalResults,
}) => {
  const hasActiveFilters =
    filters.state !== 'All' ||
    filters.family !== 'All' ||
    filters.region !== 'All' ||
    filters.search !== '' ||
    filters.sort !== 'popular';

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900 font-serif font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-amber-800" />
          <span>Curate Instruments</span>
          <span className="text-xs font-sans font-normal text-stone-500 ml-1">
            ({totalResults} {totalResults === 1 ? 'heritage piece' : 'heritage pieces'})
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Filter Row 1: Family Pill Buttons */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
          Instrument Family
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FAMILIES.map((fam) => {
            const active = filters.family === fam;
            return (
              <button
                key={fam}
                onClick={() => onFilterChange({ family: fam })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-stone-100/90 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {fam}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Row 2: Region / Zone Pill Buttons */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
          Geographic Zone
        </label>
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((reg) => {
            const active = filters.region === reg;
            return (
              <button
                key={reg}
                onClick={() => onFilterChange({ region: reg })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'bg-stone-100/90 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {reg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dropdown Row: State Selection & Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* State Selection Dropdown */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            Select State
          </label>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange({ state: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 cursor-pointer shadow-xs"
          >
            <option value="All">All States of India</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            Sort Order
          </label>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange({ sort: e.target.value as SortOption })}
            className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 cursor-pointer shadow-xs"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
