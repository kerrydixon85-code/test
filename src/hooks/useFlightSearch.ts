import { useState, useEffect } from 'react';
import type { Flight, SearchFilters } from '../types';
import { searchFlights } from '../services/api';
import { FLIGHTS } from '../data/flights';

const USE_API = import.meta.env.VITE_USE_API === 'true';

interface UseFlightSearchResult {
  flights: Flight[];
  loading: boolean;
  error: string | null;
  cached: boolean;
  scrapedAt: string | null;
}

/**
 * Hook to search for flights using either the API or fallback to dummy data
 */
export function useFlightSearch(searchFilters: SearchFilters | null): UseFlightSearchResult {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [scrapedAt, setScrapedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!searchFilters) {
      setFlights([]);
      return;
    }

    const fetchFlights = async () => {
      if (!USE_API) {
        // Use dummy data (existing behavior)
        setFlights(FLIGHTS);
        setCached(false);
        setScrapedAt(null);
        return;
      }

      // Use API
      setLoading(true);
      setError(null);

      try {
        const response = await searchFlights(searchFilters);
        setFlights(response.flights);
        setCached(response.cached);
        setScrapedAt(response.scrapedAt);
      } catch (err) {
        console.error('Flight search error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to dummy data on error
        setFlights(FLIGHTS);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchFilters]);

  return { flights, loading, error, cached, scrapedAt };
}
