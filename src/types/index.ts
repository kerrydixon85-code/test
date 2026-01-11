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

export interface SearchFilters {
  origin: string;
  destination: string;
  departureDate: Date | null;
  returnDate: Date | null;
  cabinClass: CabinClass[];
  maxStops: number;
  airlines: string[];
  flexibleDates: boolean;
}
