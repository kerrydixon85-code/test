import type { Airport } from '../types';

export const UK_AIRPORTS: Airport[] = [
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'United Kingdom' },
  { code: 'LGW', name: 'London Gatwick', city: 'London', country: 'United Kingdom' },
  { code: 'STN', name: 'London Stansted', city: 'London', country: 'United Kingdom' },
  { code: 'LTN', name: 'London Luton', city: 'London', country: 'United Kingdom' },
  { code: 'LCY', name: 'London City', city: 'London', country: 'United Kingdom' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom' },
  { code: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom' },
  { code: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom' },
  { code: 'GLA', name: 'Glasgow Airport', city: 'Glasgow', country: 'United Kingdom' },
  { code: 'BRS', name: 'Bristol Airport', city: 'Bristol', country: 'United Kingdom' },
  { code: 'NCL', name: 'Newcastle Airport', city: 'Newcastle', country: 'United Kingdom' },
  { code: 'LBA', name: 'Leeds Bradford Airport', city: 'Leeds', country: 'United Kingdom' },
];

export const INTERNATIONAL_AIRPORTS: Airport[] = [
  // North America
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'United States' },
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada' },

  // Europe
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Barcelona-El Prat', city: 'Barcelona', country: 'Spain' },
  { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino', city: 'Rome', country: 'Italy' },
  { code: 'MXP', name: 'Milan Malpensa', city: 'Milan', country: 'Italy' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden' },

  // Asia
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'United Arab Emirates' },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar' },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
  { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India' },

  // Oceania
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },

  // Africa
  { code: 'JNB', name: 'OR Tambo International', city: 'Johannesburg', country: 'South Africa' },
  { code: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa' },
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt' },

  // South America
  { code: 'GRU', name: 'São Paulo/Guarulhos International', city: 'São Paulo', country: 'Brazil' },
  { code: 'EZE', name: 'Ministro Pistarini International', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia' },
];

export const ALL_AIRPORTS = [...UK_AIRPORTS, ...INTERNATIONAL_AIRPORTS];
