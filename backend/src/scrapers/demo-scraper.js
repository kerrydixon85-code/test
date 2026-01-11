import { BaseScraper } from './base-scraper.js';
import { format, eachDayOfInterval } from 'date-fns';

/**
 * Demo scraper that generates realistic flight data
 * Replace this with actual scraping logic for production
 */
export class DemoScraper extends BaseScraper {
  constructor(airlineCode, airlineName) {
    super(airlineCode, airlineName);
  }

  async search(params) {
    const { origin, destination, startDate, endDate, cabinClass = 'economy' } = params;

    console.log(`[${this.airlineCode}] Scraping ${origin} → ${destination} (${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')})`);

    // Simulate network delay
    await this.randomDelay(1000, 3000);

    const flights = [];
    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    // Generate flights for each date
    for (const date of dates) {
      const numFlightsThisDay = this.randomInt(0, 4); // 0-4 flights per day

      for (let i = 0; i < numFlightsThisDay; i++) {
        const flight = this.generateFlight({
          origin,
          destination,
          date,
          cabinClass
        });
        flights.push(flight);
      }
    }

    console.log(`[${this.airlineCode}] Found ${flights.length} flights`);
    return flights;
  }

  generateFlight({ origin, destination, date, cabinClass }) {
    const distance = this.estimateDistance(origin, destination);
    const baseMiles = this.calculateBaseMiles(distance);
    const cabinMultipliers = {
      economy: 1,
      premium_economy: 1.5,
      business: 2.5,
      first: 4
    };

    const stops = this.randomElement([0, 0, 0, 1, 1, 2]); // More direct flights
    const milesRequired = Math.round(baseMiles * cabinMultipliers[cabinClass] * (stops === 0 ? 1 : 1.2));

    const departureHour = this.randomInt(6, 22);
    const departureMinute = this.randomElement([0, 15, 30, 45]);
    const duration = Math.round(distance / 8 + this.randomInt(-30, 30)); // ~500 mph

    const arrivalMinutes = departureHour * 60 + departureMinute + duration;
    const arrivalHour = Math.floor(arrivalMinutes / 60) % 24;
    const arrivalMinute = arrivalMinutes % 60;

    return {
      id: this.generateId(),
      airline: this.airlineCode,
      flightNumber: `${this.airlineCode}${this.randomInt(100, 9999)}`,
      origin,
      destination,
      date: format(date, 'yyyy-MM-dd'),
      departureTime: `${String(departureHour).padStart(2, '0')}:${String(departureMinute).padStart(2, '0')}`,
      arrivalTime: `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinute).padStart(2, '0')}`,
      duration,
      stops,
      cabinClass,
      milesRequired,
      availability: this.randomInt(1, 9),
      scrapedAt: new Date().toISOString()
    };
  }

  estimateDistance(origin, destination) {
    // Rough distance estimates by region
    const regions = {
      'Europe': 1500,
      'North America': 4500,
      'Middle East': 3500,
      'Asia': 6000,
      'Oceania': 11000,
      'Africa': 5000,
      'South America': 7000
    };

    // Simple heuristic based on destination code
    const region = this.guessRegion(destination);
    return regions[region] || 3000;
  }

  guessRegion(code) {
    // Very simplified region detection
    const european = ['CDG', 'AMS', 'FRA', 'MAD', 'BCN', 'FCO', 'MXP', 'ZRH', 'VIE', 'CPH', 'ARN'];
    const northAmerican = ['JFK', 'LAX', 'SFO', 'MIA', 'ORD', 'YYZ', 'YVR'];
    const middleEast = ['DXB', 'DOH', 'CAI'];
    const asian = ['SIN', 'HKG', 'NRT', 'HND', 'ICN', 'BKK', 'DEL', 'BOM'];
    const oceanian = ['SYD', 'MEL', 'AKL'];
    const african = ['JNB', 'CPT'];
    const southAmerican = ['GRU', 'EZE', 'BOG'];

    if (european.includes(code)) return 'Europe';
    if (northAmerican.includes(code)) return 'North America';
    if (middleEast.includes(code)) return 'Middle East';
    if (asian.includes(code)) return 'Asia';
    if (oceanian.includes(code)) return 'Oceania';
    if (african.includes(code)) return 'Africa';
    if (southAmerican.includes(code)) return 'South America';

    return 'North America'; // default
  }

  calculateBaseMiles(distance) {
    return Math.round(distance / 10) * 1000;
  }
}

// Create scrapers for different airlines
export const scrapers = {
  'UA': new DemoScraper('UA', 'United Airlines'),
  'BA': new DemoScraper('BA', 'British Airways'),
  'AA': new DemoScraper('AA', 'American Airlines'),
  'DL': new DemoScraper('DL', 'Delta Air Lines'),
  'AC': new DemoScraper('AC', 'Air Canada'),
};

export function getScraper(airlineCode) {
  return scrapers[airlineCode] || scrapers['UA'];
}
