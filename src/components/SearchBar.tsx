import { useState } from 'react';
import { Plane, Calendar, Users, ArrowLeftRight, CalendarRange } from 'lucide-react';
import { UK_AIRPORTS, INTERNATIONAL_AIRPORTS } from '../data/airports';
import type { SearchFilters, CabinClass, SearchMode, SortOption } from '../types';
import { addMonths, format } from 'date-fns';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [origin, setOrigin] = useState('LHR');
  const [destination, setDestination] = useState('JFK');
  const [searchMode, setSearchMode] = useState<SearchMode>('range');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [endDate, setEndDate] = useState(format(addMonths(new Date(), 6), 'yyyy-MM-dd'));
  const [cabinClass, setCabinClass] = useState<CabinClass[]>(['economy']);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('miles');

  const handleSearch = () => {
    onSearch({
      origin,
      destination,
      searchMode,
      departureDate: departureDate ? new Date(departureDate) : null,
      returnDate: isRoundTrip && returnDate ? new Date(returnDate) : null,
      endDate: searchMode === 'range' && endDate ? new Date(endDate) : null,
      cabinClass,
      maxStops: 2,
      airlines: [],
      isRoundTrip,
      sortBy,
    });
  };

  return (
    <div className="glass rounded-2xl p-6 mb-8">
      {/* Search Mode Toggle */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setSearchMode('specific')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            searchMode === 'specific'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Specific Dates
          </div>
        </button>
        <button
          onClick={() => setSearchMode('range')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            searchMode === 'range'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <CalendarRange className="w-4 h-4" />
            6-Month Range
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Origin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              From
            </div>
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {UK_AIRPORTS.map((airport) => (
              <option key={airport.code} value={airport.code}>
                {airport.code} - {airport.city}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 rotate-90" />
              To
            </div>
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {INTERNATIONAL_AIRPORTS.map((airport) => (
              <option key={airport.code} value={airport.code}>
                {airport.code} - {airport.city}
              </option>
            ))}
          </select>
        </div>

        {/* Dates - Conditional based on search mode */}
        {searchMode === 'specific' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Departure
                </div>
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            {isRoundTrip && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Return
                  </div>
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
            )}
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <CalendarRange className="w-4 h-4" />
                Search Until
              </div>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        )}

        {/* Cabin Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Cabin Class
            </div>
          </label>
          <select
            value={cabinClass[0]}
            onChange={(e) => setCabinClass([e.target.value as CabinClass])}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="economy">Economy</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* Round Trip Toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isRoundTrip}
              onChange={(e) => setIsRoundTrip(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <ArrowLeftRight className="w-4 h-4" />
            Round Trip
          </label>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              <option value="miles">Miles (Low to High)</option>
              <option value="date">Date (Earliest First)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          Search Flights
        </button>
      </div>
    </div>
  );
}
