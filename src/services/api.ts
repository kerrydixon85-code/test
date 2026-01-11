import type { Flight, SearchFilters } from '../types';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface SearchParams {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  cabinClass?: string;
  airline?: string;
}

export interface SearchResponse {
  flights: Flight[];
  cached: boolean;
  scrapedAt: string;
}

/**
 * Search for flights via the backend API
 */
export async function searchFlights(filters: SearchFilters): Promise<SearchResponse> {
  const params: SearchParams = {
    origin: filters.origin,
    destination: filters.destination,
    startDate: filters.departureDate
      ? format(filters.departureDate, 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd'),
    endDate: filters.endDate
      ? format(filters.endDate, 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd'),
    cabinClass: filters.cabinClass[0] || 'economy',
    airline: 'UA', // Default to United for now
  };

  const response = await fetch(`${API_BASE_URL}/api/flights/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get cached flights from database
 */
export async function getFlights(params: {
  origin: string;
  destination: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ flights: Flight[]; count: number }> {
  const queryParams = new URLSearchParams(params as any);

  const response = await fetch(`${API_BASE_URL}/api/flights?${queryParams}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}
