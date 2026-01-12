# Getting Started with Web Scraping

## ✅ What's Been Built

You now have a complete backend scraping infrastructure:

1. **Express API Server** (`backend/`) - REST API for flight searches
2. **Database Layer** - SQLite for storing scraped flights
3. **Demo Scraper** - Generates realistic flight data (ready to replace with real scrapers)
4. **Frontend Integration** - API service layer and React hook

## 🚀 Running the Full Stack

### Terminal 1 - Backend API:
```bash
cd backend
npm start
```
Backend will run on http://localhost:3001

### Terminal 2 - Frontend:
```bash
npm run dev
```
Frontend will run on http://localhost:5173

## 🧪 Testing the Backend

```bash
# Health check
curl http://localhost:3001/health

# Search flights
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

## 📂 Project Structure

```
.
├── backend/                    # Backend API & Scrapers
│   ├── src/
│   │   ├── index.js           # Express server
│   │   ├── routes/
│   │   │   └── flights.js     # API endpoints
│   │   ├── scrapers/
│   │   │   ├── base-scraper.js
│   │   │   └── demo-scraper.js  # ⭐ Replace this with real scrapers
│   │   └── models/
│   │       └── database.js    # SQLite database
│   ├── data/                  # Database storage
│   └── package.json
│
├── src/                       # Frontend React App
│   ├── services/
│   │   └── api.ts            # Backend API client
│   └── hooks/
│       └── useFlightSearch.ts # React hook for API calls
│
└── SCRAPING_GUIDE.md         # Comprehensive scraping documentation
```

## 🎯 Next Steps - Replace Demo Scraper with Real Ones

### Option 1: Start with British Airways (Easiest)

British Airways has a simple HTML structure, perfect for learning:

```javascript
// backend/src/scrapers/british-airways.js
import { BaseScraper } from './base-scraper.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

export class BritishAirwaysScraper extends BaseScraper {
  constructor() {
    super('BA', 'British Airways');
  }

  async search(params) {
    const url = `https://www.britishairways.com/travel/redeem/execclub/_gf/en_gb`;

    try {
      const response = await axios.get(url, {
        params: {
          'departurePoint': params.origin,
          'destinationPoint': params.destination,
          'departureDate': params.startDate,
          'cabinClass': params.cabinClass,
        },
        headers: {
          'User-Agent': 'Mozilla/5.0...',
        }
      });

      const $ = cheerio.load(response.data);
      const flights = [];

      $('.flight-result').each((i, elem) => {
        flights.push({
          id: this.generateId(),
          airline: 'BA',
          flightNumber: $(elem).find('.flight-number').text(),
          // ... parse other fields
        });
      });

      return flights;
    } catch (error) {
      console.error('BA scraper error:', error);
      return [];
    }
  }
}
```

### Option 2: United Airlines with Puppeteer (More Complex)

```bash
# Install Puppeteer
cd backend
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
```

```javascript
// backend/src/scrapers/united.js
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { BaseScraper } from './base-scraper.js';

puppeteer.use(StealthPlugin());

export class UnitedScraper extends BaseScraper {
  constructor() {
    super('UA', 'United Airlines');
  }

  async search(params) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto('https://www.united.com/en/us/fsr/choose-flights');

      // Fill search form
      await page.type('#origin', params.origin);
      await page.type('#destination', params.destination);
      await page.click('#departDate');
      await page.click(`[data-date="${params.startDate}"]`);
      await page.click('#awardTravel'); // Award search checkbox
      await page.click('#submit-button');

      // Wait for results
      await page.waitForSelector('.flight-results');

      // Extract data
      const flights = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('.flight-card').forEach(card => {
          results.push({
            flightNumber: card.querySelector('.flight-number')?.textContent,
            miles: card.querySelector('.miles-required')?.textContent,
            // ... extract more fields
          });
        });
        return results;
      });

      return flights;
    } finally {
      await browser.close();
    }
  }
}
```

### Integrate New Scrapers

```javascript
// backend/src/scrapers/demo-scraper.js
import { BritishAirwaysScraper } from './british-airways.js';
import { UnitedScraper } from './united.js';

export const scrapers = {
  'BA': new BritishAirwaysScraper(),
  'UA': new UnitedScraper(),
  // Add more as you build them
};
```

## 🛡️ Anti-Detection Best Practices

### 1. Rate Limiting
```javascript
// Delay between requests
await this.randomDelay(2000, 5000); // 2-5 seconds
```

### 2. User Agent Rotation
```javascript
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
  // 20+ more
];

headers: {
  'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
}
```

### 3. Proxy Rotation (Optional)
```javascript
// Use free proxies or services like:
// - Bright Data
// - Smartproxy
// - Oxylabs

const proxy = 'http://proxy-server:port';
const response = await axios.get(url, {
  proxy: {
    host: 'proxy-server',
    port: 8080
  }
});
```

### 4. Headless Browser Stealth
```javascript
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

// Additional stealth measures
await page.setUserAgent('...');
await page.setViewport({ width: 1920, height: 1080 });
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
});
```

## 📅 Background Scraping (Coming Soon)

Add scheduled scraping for popular routes:

```javascript
// backend/src/jobs/scheduler.js
import cron from 'node-cron';
import { getScraper } from '../scrapers/demo-scraper.js';

// Scrape every 4 hours
cron.schedule('0 */4 * * *', async () => {
  console.log('Running scheduled scrape...');

  const popularRoutes = [
    { origin: 'LHR', destination: 'JFK' },
    { origin: 'LHR', destination: 'SFO' },
    { origin: 'LHR', destination: 'SYD' },
    // Add more
  ];

  for (const route of popularRoutes) {
    const scraper = getScraper('UA');
    await scraper.search({
      ...route,
      startDate: new Date(),
      endDate: addMonths(new Date(), 6)
    });

    // Save to database
    // ...

    // Rate limit between routes
    await delay(60000); // 1 minute
  }
});
```

## 🚨 Important Notes

### Legal & Ethical
- ⚠️ Web scraping may violate Terms of Service
- 🎯 Use for personal/educational purposes
- 🤝 Plan to migrate to official APIs when possible
- 📊 Be respectful with rate limiting

### Performance
- Cache aggressively (4-hour default)
- Scrape popular routes on schedule
- On-demand scraping for less common routes
- Clean up old data regularly

### Reliability
- Handle errors gracefully
- Retry failed requests (with backoff)
- Monitor scraping success rate
- Log errors for debugging

## 📊 Monitoring Your Scrapers

```javascript
// Add logging
console.log(`[${airline}] Scraping ${origin} → ${destination}`);
console.log(`[${airline}] Found ${flights.length} flights`);
console.log(`[${airline}] Cached: ${cached}, Scraped at: ${scrapedAt}`);

// Track metrics
{
  total_searches: 1234,
  cache_hits: 800,
  cache_misses: 434,
  avg_response_time: '2.3s',
  errors: 12
}
```

## 🎯 Roadmap

**Week 1-2:** (You are here)
- ✅ Backend infrastructure
- ✅ Demo scraper
- ✅ API endpoints
- 🔄 Replace with 1-2 real scrapers

**Week 3-4:**
- Add 3-5 more airline scrapers
- Implement background job queue
- Add proxy rotation
- Deploy to production

**Month 2:**
- Cover 10+ airlines
- Build alert system
- Add monitoring
- Scale infrastructure

**Month 3+:**
- 20+ airline programs
- Premium cabin finders
- Mobile app integration
- Revenue from Pro subscriptions

## 💰 Cost Considerations

**Current (Free):**
- ✅ SQLite database (free)
- ✅ Express server (free to run)
- ✅ Demo data (free)

**With Real Scraping:**
- Proxies: $30-100/month (optional for now)
- Server: $20-50/month (Digital Ocean, AWS)
- Monitoring: $0-30/month (free tier available)

**Total:** $20-180/month to start

## 📚 Resources

- [SCRAPING_GUIDE.md](./SCRAPING_GUIDE.md) - Comprehensive scraping documentation
- [Puppeteer Docs](https://pptr.dev/)
- [Puppeteer Extra Stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)
- [Cheerio Docs](https://cheerio.js.org/)

## 🆘 Need Help?

Common issues:

**Backend won't start:**
```bash
cd backend
npm install
npm start
```

**Database locked error:**
```bash
rm backend/data/flights.db
# Restart backend (will recreate DB)
```

**CORS errors:**
- Backend must be running on :3001
- Frontend must be running on :5173
- CORS is already configured

**No flights returned:**
- Check backend logs
- Try different route/dates
- Demo scraper might have 0 flights for some dates (random)

---

**You're all set!** Start replacing the demo scraper with real ones and you'll have a functioning award search engine. 🚀
