export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
  logo?: string;
}

export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  stops: number;
  cabinClass: CabinClass;
  milesRequired: number;
  availability: number; // seats available
  date: string;
}

export type SearchMode = 'specific' | 'range';
export type SortOption = 'miles' | 'date';

export interface SearchFilters {
  origin: string;
  destination: string;
  searchMode: SearchMode;
  departureDate: Date | null;
  returnDate: Date | null;
  endDate: Date | null; // For 6-month range search
  cabinClass: CabinClass[];
  maxStops: number;
  airlines: string[];
  isRoundTrip: boolean;
  sortBy: SortOption;
}
