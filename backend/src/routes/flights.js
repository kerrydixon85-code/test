import express from 'express';
import { queries } from '../models/database.js';
import { getScraper } from '../scrapers/demo-scraper.js';
import { addDays, parseISO, format } from 'date-fns';

const router = express.Router();

/**
 * POST /api/flights/search
 * Search for flights (triggers scraping if needed)
 */
router.post('/search', async (req, res) => {
  try {
    const {
      origin,
      destination,
      startDate,
      endDate,
      cabinClass = 'economy',
      airline = 'UA'
    } = req.body;

    // Validate inputs
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination required' });
    }

    const start = startDate ? parseISO(startDate) : new Date();
    const end = endDate ? parseISO(endDate) : addDays(start, 7);

    // Check if we have cached data
    const cached = queries.getFlights.all(
      origin,
      destination,
      format(start, 'yyyy-MM-dd'),
      format(end, 'yyyy-MM-dd')
    );

    // If we have recent data (less than 4 hours old), return it
    const now = new Date();
    const recentFlights = cached.filter(f => {
      const scrapedAt = new Date(f.scraped_at);
      const hoursSinceScraped = (now - scrapedAt) / (1000 * 60 * 60);
      return hoursSinceScraped < 4;
    });

    if (recentFlights.length > 0) {
      console.log(`Returning ${recentFlights.length} cached flights`);
      return res.json({
        flights: recentFlights.map(normalizeFlightFromDb),
        cached: true,
        scrapedAt: recentFlights[0].scraped_at
      });
    }

    // Otherwise, scrape fresh data
    console.log(`No cache, scraping fresh data for ${origin} → ${destination}`);

    const scraper = getScraper(airline);
    const flights = await scraper.search({
      origin,
      destination,
      startDate: start,
      endDate: end,
      cabinClass
    });

    // Save to database
    const insertMany = queries.insertFlight;
    const transaction = insertMany.run.bind(insertMany);

    for (const flight of flights) {
      insertMany.run(
        flight.id,
        flight.airline,
        flight.flightNumber,
        flight.origin,
        flight.destination,
        flight.date,
        flight.departureTime,
        flight.arrivalTime,
        flight.duration,
        flight.stops,
        flight.cabinClass,
        flight.milesRequired,
        flight.availability,
        flight.scrapedAt
      );
    }

    console.log(`Saved ${flights.length} flights to database`);

    res.json({
      flights: flights.map(normalizeFlight),
      cached: false,
      scrapedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/flights
 * Get flights from database
 */
router.get('/', async (req, res) => {
  try {
    const {
      origin,
      destination,
      startDate,
      endDate
    } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination required' });
    }

    const start = startDate || format(new Date(), 'yyyy-MM-dd');
    const end = endDate || format(addDays(new Date(), 180), 'yyyy-MM-dd');

    const flights = queries.getFlights.all(origin, destination, start, end);

    res.json({
      flights: flights.map(normalizeFlightFromDb),
      count: flights.length
    });

  } catch (error) {
    console.error('Get flights error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Normalize flight from database format to API format
 */
function normalizeFlightFromDb(dbFlight) {
  return {
    id: dbFlight.id,
    airline: {
      code: dbFlight.airline,
      name: getAirlineName(dbFlight.airline)
    },
    flightNumber: dbFlight.flight_number,
    origin: {
      code: dbFlight.origin,
      name: dbFlight.origin,
      city: dbFlight.origin,
      country: ''
    },
    destination: {
      code: dbFlight.destination,
      name: dbFlight.destination,
      city: dbFlight.destination,
      country: ''
    },
    departureTime: dbFlight.departure_time,
    arrivalTime: dbFlight.arrival_time,
    duration: dbFlight.duration,
    stops: dbFlight.stops,
    cabinClass: dbFlight.cabin_class,
    milesRequired: dbFlight.miles_required,
    availability: dbFlight.availability,
    date: dbFlight.date
  };
}

/**
 * Normalize flight from scraper format to API format
 */
function normalizeFlight(flight) {
  return {
    id: flight.id,
    airline: {
      code: flight.airline,
      name: getAirlineName(flight.airline)
    },
    flightNumber: flight.flightNumber,
    origin: {
      code: flight.origin,
      name: flight.origin,
      city: flight.origin,
      country: ''
    },
    destination: {
      code: flight.destination,
      name: flight.destination,
      city: flight.destination,
      country: ''
    },
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    duration: flight.duration,
    stops: flight.stops,
    cabinClass: flight.cabinClass,
    milesRequired: flight.milesRequired,
    availability: flight.availability,
    date: flight.date
  };
}

function getAirlineName(code) {
  const names = {
    'UA': 'United Airlines',
    'BA': 'British Airways',
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'AC': 'Air Canada',
  };
  return names[code] || code;
}

export default router;
