import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { AIRLINES } from '../data/airlines';
import type { CabinClass } from '../types';

interface FilterSidebarProps {
  onFilterChange: (filters: {
    airlines: string[];
    cabinClasses: CabinClass[];
    maxStops: number;
    maxMiles: number;
  }) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedCabinClasses, setSelectedCabinClasses] = useState<CabinClass[]>([]);
  const [maxStops, setMaxStops] = useState(2);
  const [maxMiles, setMaxMiles] = useState(500000);

  const handleAirlineToggle = (airlineCode: string) => {
    const updated = selectedAirlines.includes(airlineCode)
      ? selectedAirlines.filter((a) => a !== airlineCode)
      : [...selectedAirlines, airlineCode];
    setSelectedAirlines(updated);
    applyFilters({ airlines: updated });
  };

  const handleCabinClassToggle = (cabinClass: CabinClass) => {
    const updated = selectedCabinClasses.includes(cabinClass)
      ? selectedCabinClasses.filter((c) => c !== cabinClass)
      : [...selectedCabinClasses, cabinClass];
    setSelectedCabinClasses(updated);
    applyFilters({ cabinClasses: updated });
  };

  const handleMaxStopsChange = (stops: number) => {
    setMaxStops(stops);
    applyFilters({ maxStops: stops });
  };

  const handleMaxMilesChange = (miles: number) => {
    setMaxMiles(miles);
    applyFilters({ maxMiles: miles });
  };

  const applyFilters = (updates: Partial<{
    airlines: string[];
    cabinClasses: CabinClass[];
    maxStops: number;
    maxMiles: number;
  }>) => {
    onFilterChange({
      airlines: updates.airlines ?? selectedAirlines,
      cabinClasses: updates.cabinClasses ?? selectedCabinClasses,
      maxStops: updates.maxStops ?? maxStops,
      maxMiles: updates.maxMiles ?? maxMiles,
    });
  };

  const clearFilters = () => {
    setSelectedAirlines([]);
    setSelectedCabinClasses([]);
    setMaxStops(2);
    setMaxMiles(500000);
    onFilterChange({
      airlines: [],
      cabinClasses: [],
      maxStops: 2,
      maxMiles: 500000,
    });
  };

  return (
    <div className="glass rounded-xl p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        {(selectedAirlines.length > 0 || selectedCabinClasses.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Cabin Class */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Cabin Class</h3>
        <div className="space-y-2">
          {(['economy', 'premium_economy', 'business', 'first'] as CabinClass[]).map((cabinClass) => (
            <label key={cabinClass} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCabinClasses.includes(cabinClass)}
                onChange={() => handleCabinClassToggle(cabinClass)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {cabinClass.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Stops */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Maximum Stops</h3>
        <div className="space-y-2">
          {[0, 1, 2].map((stops) => (
            <label key={stops} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="stops"
                checked={maxStops === stops}
                onChange={() => handleMaxStopsChange(stops)}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {stops === 0 ? 'Non-stop only' : `Up to ${stops} stop${stops > 1 ? 's' : ''}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Miles Range */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Maximum Miles</h3>
        <input
          type="range"
          min="50000"
          max="500000"
          step="10000"
          value={maxMiles}
          onChange={(e) => handleMaxMilesChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2 text-center">
          Up to {maxMiles.toLocaleString()} miles
        </div>
      </div>

      {/* Airlines */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Airlines</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {AIRLINES.slice(0, 15).map((airline) => (
            <label key={airline.code} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline.code)}
                onChange={() => handleAirlineToggle(airline.code)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{airline.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
