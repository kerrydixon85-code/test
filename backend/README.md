# AirMiles Backend API

Web scraping backend for AirMiles Flight Search application.

## 🚀 Quick Start

```bash
cd backend
npm install
npm start
```

The API will be available at `http://localhost:3001`

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Search Flights
```bash
POST /api/flights/search
Content-Type: application/json

{
  "origin": "LHR",
  "destination": "JFK",
  "startDate": "2026-02-01",
  "endDate": "2026-02-07",
  "cabinClass": "economy",
  "airline": "UA"
}
```

Response:
```json
{
  "flights": [...],
  "cached": false,
  "scrapedAt": "2026-01-11T22:59:35.398Z"
}
```

### Get Cached Flights
```bash
GET /api/flights?origin=LHR&destination=JFK&startDate=2026-02-01&endDate=2026-02-07
```

## 🔧 Configuration

Edit `.env` file:

```env
PORT=3001
DATABASE_PATH=./data/flights.db
SCRAPE_DELAY_MIN=2000
SCRAPE_DELAY_MAX=5000
```

## 🗄️ Database

Uses SQLite for simplicity. Database file located at `backend/data/flights.db`

Tables:
- `flights` - Scraped flight data
- `routes` - Tracked routes
- `scrape_jobs` - Scraping job history
- `alerts` - User flight alerts

## 🕷️ Scrapers

Currently using **DemoScraper** that generates realistic flight data.

### Adding Real Scrapers

1. Create new scraper in `src/scrapers/`
2. Extend `BaseScraper` class
3. Implement `search()` method
4. Register in `demo-scraper.js` scrapers object

Example:
```javascript
import { BaseScraper } from './base-scraper.js';
import puppeteer from 'puppeteer';

export class UnitedScraper extends BaseScraper {
  async search(params) {
    // Your scraping logic here
    const browser = await puppeteer.launch();
    // ...
    return flights;
  }
}
```

## 📋 Current Status

✅ Demo scraper (generates data)
✅ SQLite database
✅ REST API endpoints
✅ Caching (4 hour TTL)
✅ Multiple airline support

🚧 To be added:
- Real Puppeteer scrapers
- Proxy rotation
- Rate limiting
- Background job scheduler
- Alert system

## 🛡️ Anti-Detection Features

When implementing real scrapers:

1. **User Agent Rotation** - Randomize browser fingerprints
2. **Rate Limiting** - Max 1-2 requests per second
3. **Delays** - Random delays between actions
4. **Proxies** - Rotate IP addresses
5. **Stealth Mode** - Use puppeteer-extra-plugin-stealth

## 📊 Testing

Test the scraper:
```bash
# Search for flights
curl -X POST http://localhost:3001/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "origin":"LHR",
    "destination":"JFK",
    "startDate":"2026-02-01",
    "endDate":"2026-02-07",
    "airline":"UA"
  }'
```

## 🔄 Data Freshness

- Fresh scrapes: Real-time data
- Cached data: < 4 hours old
- Old data: Automatically cleaned up (> 24 hours)

## 📝 Next Steps

1. **Replace DemoScraper** with real Puppeteer scrapers
2. **Add Proxy Support** for IP rotation
3. **Implement Job Queue** with Bull/Redis
4. **Add Monitoring** (Sentry, DataDog)
5. **Deploy** to production (AWS, Google Cloud)

## ⚠️ Legal Notice

Web scraping may violate airline Terms of Service. Use responsibly:
- Respect rate limits
- Cache aggressively
- Plan migration to official APIs
- Use for personal/educational purposes only
