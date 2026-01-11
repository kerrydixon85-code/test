import { useState, useMemo } from 'react';
import { Plane, Calendar } from 'lucide-react';
import SearchBar from './components/SearchBar';
import FlightCard from './components/FlightCard';
import FilterSidebar from './components/FilterSidebar';
import { FLIGHTS } from './data/flights';
import type { SearchFilters, CabinClass } from './types';
import { addDays, format, isWithinInterval } from 'date-fns';

function App() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [additionalFilters, setAdditionalFilters] = useState<{
    airlines: string[];
    cabinClasses: CabinClass[];
    maxStops: number;
    maxMiles: number;
  }>({
    airlines: [],
    cabinClasses: [],
    maxStops: 2,
    maxMiles: 500000,
  });

  const filteredFlights = useMemo(() => {
    if (!searchFilters) return [];

    return FLIGHTS.filter((flight) => {
      // Origin and destination
      if (flight.origin.code !== searchFilters.origin) return false;
      if (flight.destination.code !== searchFilters.destination) return false;

      // Date filtering
      if (searchFilters.departureDate) {
        const flightDate = new Date(flight.date);
        if (searchFilters.flexibleDates) {
          const startDate = addDays(searchFilters.departureDate, -3);
          const endDate = addDays(searchFilters.departureDate, 3);
          if (!isWithinInterval(flightDate, { start: startDate, end: endDate })) {
            return false;
          }
        } else {
          if (format(flightDate, 'yyyy-MM-dd') !== format(searchFilters.departureDate, 'yyyy-MM-dd')) {
            return false;
          }
        }
      }

      // Cabin class (from search)
      if (searchFilters.cabinClass.length > 0 && !searchFilters.cabinClass.includes(flight.cabinClass)) {
        return false;
      }

      // Additional filters
      if (additionalFilters.cabinClasses.length > 0 && !additionalFilters.cabinClasses.includes(flight.cabinClass)) {
        return false;
      }

      if (additionalFilters.airlines.length > 0 && !additionalFilters.airlines.includes(flight.airline.code)) {
        return false;
      }

      if (flight.stops > additionalFilters.maxStops) return false;
      if (flight.milesRequired > additionalFilters.maxMiles) return false;

      return true;
    }).sort((a, b) => a.milesRequired - b.milesRequired);
  }, [searchFilters, additionalFilters]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-white rotate-45" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AirMiles Flight Search
              </h1>
              <p className="text-sm text-gray-600">Find the best award flights from UK airports</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar onSearch={setSearchFilters} />

        {searchFilters ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterSidebar onFilterChange={setAdditionalFilters} />
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {filteredFlights.length} Flight{filteredFlights.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-gray-600">
                  {searchFilters.origin} → {searchFilters.destination}
                  {searchFilters.departureDate && (
                    <span className="ml-2">
                      • {format(searchFilters.departureDate, 'MMM dd, yyyy')}
                      {searchFilters.flexibleDates && ' (±3 days)'}
                    </span>
                  )}
                </p>
              </div>

              {filteredFlights.length > 0 ? (
                <div className="space-y-4">
                  {filteredFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                </div>
              ) : (
                <div className="glass rounded-xl p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <Plane className="w-16 h-16 text-blue-600 mx-auto mb-4 rotate-45" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Search for award flights
            </h3>
            <p className="text-gray-600">
              Enter your travel details above to find the best flights using your airmiles
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>AirMiles Flight Search - Find the best award flights from UK airports</p>
          <p className="mt-2">Dummy data for demonstration purposes only</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
