import { useState, useMemo } from 'react';
import { Plane, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import SearchBar from './components/SearchBar';
import FlightCard from './components/FlightCard';
import FilterSidebar from './components/FilterSidebar';
import CalendarView from './components/CalendarView';
import { FLIGHTS } from './data/flights';
import type { SearchFilters, CabinClass } from './types';
import { format, isBefore, isAfter } from 'date-fns';

function App() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);
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

    let flights = FLIGHTS.filter((flight) => {
      // Origin and destination
      if (flight.origin.code !== searchFilters.origin) return false;
      if (flight.destination.code !== searchFilters.destination) return false;

      // Date filtering based on search mode
      const flightDate = new Date(flight.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (searchFilters.searchMode === 'specific' && searchFilters.departureDate) {
        // Specific date mode
        if (format(flightDate, 'yyyy-MM-dd') !== format(searchFilters.departureDate, 'yyyy-MM-dd')) {
          return false;
        }
      } else if (searchFilters.searchMode === 'range') {
        // Range mode - from today to endDate
        const endDate = searchFilters.endDate || new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000);
        if (isBefore(flightDate, today) || isAfter(flightDate, endDate)) {
          return false;
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
    });

    // Apply sorting
    if (searchFilters.sortBy === 'miles') {
      flights = flights.sort((a, b) => a.milesRequired - b.milesRequired);
    } else {
      flights = flights.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return flights;
  }, [searchFilters, additionalFilters]);

  // Find return flights if round trip
  const returnFlights = useMemo(() => {
    if (!searchFilters?.isRoundTrip || !searchFilters.returnDate) return [];

    return FLIGHTS.filter((flight) => {
      // Swap origin and destination for return
      if (flight.origin.code !== searchFilters.destination) return false;
      if (flight.destination.code !== searchFilters.origin) return false;

      // Check return date
      const flightDate = new Date(flight.date);
      if (format(flightDate, 'yyyy-MM-dd') !== format(searchFilters.returnDate!, 'yyyy-MM-dd')) {
        return false;
      }

      // Apply same filters
      if (searchFilters.cabinClass.length > 0 && !searchFilters.cabinClass.includes(flight.cabinClass)) {
        return false;
      }

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

  const handleCalendarDateSelect = (date: Date) => {
    if (searchFilters) {
      setSearchFilters({
        ...searchFilters,
        searchMode: 'specific',
        departureDate: date,
      });
      setShowCalendar(false);
    }
  };

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
        <SearchBar onSearch={(filters) => {
          setSearchFilters(filters);
          setShowCalendar(filters.searchMode === 'range');
        }} />

        {searchFilters ? (
          <>
            {/* Calendar View for Range Mode */}
            {showCalendar && searchFilters.searchMode === 'range' && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    Best Deals Calendar
                  </h2>
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                  </button>
                </div>
                <CalendarView flights={filteredFlights} onDateSelect={handleCalendarDateSelect} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <FilterSidebar onFilterChange={setAdditionalFilters} />
              </div>

              {/* Results */}
              <div className="lg:col-span-3">
                {/* Outbound Flights */}
                <div className="mb-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {searchFilters.isRoundTrip ? 'Outbound Flights' : 'Flights'}
                      <span className="ml-2 text-lg font-normal text-gray-600">
                        ({filteredFlights.length} found)
                      </span>
                    </h2>
                    <p className="text-gray-600">
                      {searchFilters.origin} → {searchFilters.destination}
                      {searchFilters.searchMode === 'specific' && searchFilters.departureDate && (
                        <span className="ml-2">
                          • {format(searchFilters.departureDate, 'MMM dd, yyyy')}
                        </span>
                      )}
                      {searchFilters.searchMode === 'range' && (
                        <span className="ml-2">
                          • Next {Math.ceil((new Date(searchFilters.endDate || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      )}
                    </p>
                  </div>

                  {filteredFlights.length > 0 ? (
                    <div className="space-y-4">
                      {filteredFlights.slice(0, 20).map((flight) => (
                        <FlightCard key={flight.id} flight={flight} />
                      ))}
                      {filteredFlights.length > 20 && (
                        <div className="text-center text-gray-600 py-4">
                          Showing 20 of {filteredFlights.length} flights. Adjust filters to refine results.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="glass rounded-xl p-12 text-center">
                      <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No outbound flights found</h3>
                      <p className="text-gray-600">
                        Try adjusting your filters or search criteria
                      </p>
                    </div>
                  )}
                </div>

                {/* Return Flights */}
                {searchFilters.isRoundTrip && searchFilters.returnDate && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Return Flights
                        <span className="ml-2 text-lg font-normal text-gray-600">
                          ({returnFlights.length} found)
                        </span>
                      </h2>
                      <p className="text-gray-600">
                        {searchFilters.destination} → {searchFilters.origin}
                        <span className="ml-2">
                          • {format(searchFilters.returnDate, 'MMM dd, yyyy')}
                        </span>
                      </p>
                    </div>

                    {returnFlights.length > 0 ? (
                      <div className="space-y-4">
                        {returnFlights.slice(0, 20).map((flight) => (
                          <FlightCard key={flight.id} flight={flight} />
                        ))}
                      </div>
                    ) : (
                      <div className="glass rounded-xl p-12 text-center">
                        <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No return flights found</h3>
                        <p className="text-gray-600">
                          Try selecting a different return date or adjusting your filters
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
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
          <p className="mt-2">Dummy data for demonstration purposes only • 2000+ flights across 180 days</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
