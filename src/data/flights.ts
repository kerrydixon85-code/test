import type { Flight, CabinClass } from '../types';
import { UK_AIRPORTS, INTERNATIONAL_AIRPORTS } from './airports';
import { AIRLINES } from './airlines';
import { addDays, format } from 'date-fns';

const CABIN_CLASSES: CabinClass[] = ['economy', 'premium_economy', 'business', 'first'];

const CABIN_MILES_MULTIPLIER: Record<CabinClass, number> = {
  economy: 1,
  premium_economy: 1.5,
  business: 2.5,
  first: 4,
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

function calculateDistance(_origin: string, destination: string): number {
  // Simplified distance calculation (in reality, this would use coordinates)
  // For now, we'll use rough estimates based on regions
  const distanceRanges: Record<string, [number, number]> = {
    'Europe': [500, 2000],
    'North America': [3500, 5500],
    'Middle East': [3000, 4500],
    'Asia': [5000, 7000],
    'Oceania': [10000, 12000],
    'Africa': [4000, 6000],
    'South America': [6000, 8000],
  };

  // Determine region based on destination country
  const destAirport = INTERNATIONAL_AIRPORTS.find(a => a.code === destination);
  if (!destAirport) return 1000;

  const country = destAirport.country;
  let region = 'Europe';

  if (country.includes('United States') || country.includes('Canada')) region = 'North America';
  else if (country.includes('Emirates') || country.includes('Qatar')) region = 'Middle East';
  else if (['Japan', 'South Korea', 'Thailand', 'Singapore', 'Hong Kong', 'India'].includes(country)) region = 'Asia';
  else if (['Australia', 'New Zealand'].includes(country)) region = 'Oceania';
  else if (['South Africa', 'Egypt'].includes(country)) region = 'Africa';
  else if (['Brazil', 'Argentina', 'Colombia'].includes(country)) region = 'South America';

  const [min, max] = distanceRanges[region];
  return randomInt(min, max);
}

function generateFlightTime(distance: number, isReturn: boolean = false): { departure: string; arrival: string; duration: number } {
  const baseHour = isReturn ? randomInt(8, 20) : randomInt(6, 22);
  const departureHour = baseHour.toString().padStart(2, '0');
  const departureMinute = randomElement(['00', '15', '30', '45']);

  const duration = Math.round(distance / 8 + randomInt(-30, 30)); // Rough speed calculation
  const arrivalTotalMinutes = baseHour * 60 + parseInt(departureMinute) + duration;
  const arrivalHour = Math.floor(arrivalTotalMinutes / 60) % 24;
  const arrivalMinute = arrivalTotalMinutes % 60;

  return {
    departure: `${departureHour}:${departureMinute}`,
    arrival: `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`,
    duration,
  };
}

export function generateFlights(count: number = 2000): Flight[] {
  const flights: Flight[] = [];
  const today = new Date();

  // Generate flights for each UK airport to popular destinations
  // This ensures good coverage for testing
  for (let i = 0; i < count; i++) {
    const origin = randomElement(UK_AIRPORTS);
    const destination = randomElement(INTERNATIONAL_AIRPORTS);
    const airline = randomElement(AIRLINES);
    const cabinClass = randomElement(CABIN_CLASSES);
    const stops = randomElement([0, 0, 0, 1, 1, 2]); // More non-stop flights
    const daysFromNow = randomInt(0, 180); // 6 months
    const date = format(addDays(today, daysFromNow), 'yyyy-MM-dd');

    const distance = calculateDistance(origin.code, destination.code);
    const baseMiles = Math.round(distance / 10) * 1000;
    const milesRequired = Math.round(baseMiles * CABIN_MILES_MULTIPLIER[cabinClass] * (stops === 0 ? 1 : 1.2));

    const { departure, arrival, duration } = generateFlightTime(distance);

    flights.push({
      id: `FL${i.toString().padStart(6, '0')}`,
      airline,
      flightNumber: `${airline.code}${randomInt(100, 9999)}`,
      origin,
      destination,
      departureTime: departure,
      arrivalTime: arrival,
      duration,
      stops,
      cabinClass,
      milesRequired,
      availability: randomInt(1, 9),
      date,
    });
  }

  return flights;
}

export const FLIGHTS = generateFlights(2000);
