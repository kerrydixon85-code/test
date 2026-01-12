# Web Scraping Implementation Guide

## ⚠️ Legal Disclaimer

**IMPORTANT:** Web scraping airline websites may violate their Terms of Service. This is intended for:
- Personal use and learning
- Proof of concept / MVP development
- With the understanding you'll migrate to official APIs when possible

**Risks:**
- IP blocking
- Legal action (cease and desist)
- Account termination
- Unreliable data

**Best Practices:**
- Respectful rate limiting (1-2 requests per second max)
- Proper user agent headers
- Rotate IPs if blocked
- Cache aggressively to reduce requests
- Plan migration to official APIs

---

## 🏗️ Architecture Overview

```
┌─────────────┐
│   Frontend  │ (React - existing)
│  Vite App   │
└──────┬──────┘
       │
       │ HTTP/WebSocket
       │
┌──────▼──────────────────────────┐
│   Backend API Server            │
│   (Node.js + Express)           │
│                                 │
│  ┌──────────────────────────┐  │
│  │  REST API Endpoints      │  │
│  │  /api/search             │  │
│  │  /api/flights            │  │
│  │  /api/alerts             │  │
│  └──────────────────────────┘  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Scraping Layer                │
│                                 │
│  ┌────────────────────────────┐│
│  │ Scraper Manager            ││
│  │  - United Airlines         ││
│  │  - British Airways         ││
│  │  - Air Canada              ││
│  │  - Delta                   ││
│  └────────────────────────────┘│
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Data Storage                  │
│   (PostgreSQL / SQLite)         │
│                                 │
│   Tables:                       │
│   - flights                     │
│   - routes                      │
│   - scrape_jobs                 │
│   - alerts                      │
└─────────────────────────────────┘
```

---

## 📦 Tech Stack

**Backend:**
- Node.js + Express (API server)
- Puppeteer (headless Chrome for complex sites)
- Axios (for simple HTTP requests)
- Cheerio (HTML parsing)
- Bull (job queue with Redis)
- Prisma (database ORM)
- PostgreSQL (production) / SQLite (development)

**Scraping Tools:**
- Puppeteer Stealth (avoid detection)
- Proxy rotation (bright data, smartproxy, or free proxies)
- User agent rotation
- Rate limiting

---

## 🎯 Phase 1: Initial Setup (Week 1)

### Airlines to Target (Easiest → Hardest):

1. **British Airways Executive Club** ⭐ EASIEST
   - Simple HTML structure
   - No complex JavaScript
   - Good for testing

2. **United MileagePlus** ⭐⭐ MEDIUM
   - React-based site
   - Requires Puppeteer
   - Most valuable (largest US program)

3. **Air Canada Aeroplan** ⭐⭐ MEDIUM
   - Similar to United
   - Good coverage

4. **Delta SkyMiles** ⭐⭐⭐ HARD
   - Heavy bot protection
   - Dynamic pricing
   - Complex flow

---

## 📋 Implementation Steps

### Step 1: Backend Setup
```bash
# Create backend directory
mkdir backend
cd backend
npm init -y

# Install dependencies
npm install express cors dotenv
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
npm install axios cheerio
npm install prisma @prisma/client
npm install bull redis
npm install node-cron

# Dev dependencies
npm install -D nodemon typescript @types/node @types/express
```

### Step 2: Database Schema
```prisma
// prisma/schema.prisma

model Flight {
  id              String   @id @default(uuid())
  airline         String   // "UA", "BA", "AC"
  flightNumber    String
  origin          String   // "LHR"
  destination     String   // "JFK"
  date            DateTime
  departureTime   String
  arrivalTime     String
  duration        Int      // minutes
  stops           Int
  cabinClass      String   // "economy", "business", "first"
  milesRequired   Int
  availability    Int      // seats available
  route           Route    @relation(fields: [routeId], references: [id])
  routeId         String
  scrapedAt       DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([origin, destination, date])
  @@index([airline, date])
}

model Route {
  id          String   @id @default(uuid())
  origin      String
  destination String
  airline     String
  isActive    Boolean  @default(true)
  lastScraped DateTime?
  flights     Flight[]

  @@unique([origin, destination, airline])
}

model ScrapeJob {
  id          String   @id @default(uuid())
  routeId     String
  airline     String
  status      String   // "pending", "running", "completed", "failed"
  startDate   DateTime
  endDate     DateTime
  startedAt   DateTime?
  completedAt DateTime?
  error       String?
  flightsFound Int     @default(0)
  createdAt   DateTime @default(now())
}

model Alert {
  id          String   @id @default(uuid())
  userId      String?  // for future user accounts
  email       String
  origin      String
  destination String
  date        DateTime?
  cabinClass  String?
  maxMiles    Int?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

### Step 3: Scraper Architecture

```typescript
// backend/src/scrapers/base.ts
export abstract class BaseScraper {
  protected airline: string;
  protected browser: Browser | null = null;

  abstract search(params: SearchParams): Promise<Flight[]>;

  async init(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected randomDelay(min: number, max: number): Promise<void> {
    const ms = Math.random() * (max - min) + min;
    return this.delay(ms);
  }
}
```

---

## 🔍 Scraping Strategy

### British Airways (Simple HTTP + Cheerio)
```typescript
// backend/src/scrapers/british-airways.ts

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base';

export class BritishAirwaysScraper extends BaseScraper {
  airline = 'BA';

  async search(params: SearchParams): Promise<Flight[]> {
    const url = `https://www.britishairways.com/travel/redeem/execclub/_gf/en_gb`;

    // Build search params
    const searchParams = {
      'departurePoint': params.origin,
      'destinationPoint': params.destination,
      'departureDate': params.date,
      'cabinClass': params.cabinClass,
      // ... more params
    };

    const response = await axios.get(url, {
      params: searchParams,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });

    const $ = cheerio.load(response.data);
    const flights: Flight[] = [];

    // Parse HTML
    $('.flight-result').each((i, elem) => {
      const flight = {
        airline: 'BA',
        flightNumber: $(elem).find('.flight-number').text(),
        origin: params.origin,
        destination: params.destination,
        // ... parse other fields
      };
      flights.push(flight);
    });

    return flights;
  }
}
```

### United Airlines (Puppeteer)
```typescript
// backend/src/scrapers/united.ts

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { BaseScraper } from './base';

puppeteer.use(StealthPlugin());

export class UnitedScraper extends BaseScraper {
  airline = 'UA';

  async search(params: SearchParams): Promise<Flight[]> {
    await this.init();
    const page = await this.browser!.newPage();

    try {
      // Navigate to United award search
      await page.goto('https://www.united.com/en/us/fsr/choose-flights', {
        waitUntil: 'networkidle2'
      });

      // Fill in search form
      await page.type('#origin', params.origin);
      await this.randomDelay(500, 1000);

      await page.type('#destination', params.destination);
      await this.randomDelay(500, 1000);

      // Click date picker
      await page.click('#departDate');
      await this.randomDelay(500, 1000);

      // Select date from calendar
      await page.click(`[data-date="${params.date}"]`);

      // Select cabin class
      await page.select('#cabinClass', params.cabinClass);

      // Check "Award travel" checkbox
      await page.click('#awardTravel');

      // Submit search
      await page.click('#submit-button');

      // Wait for results
      await page.waitForSelector('.flight-results', { timeout: 30000 });
      await this.randomDelay(2000, 3000);

      // Extract flight data
      const flights = await page.evaluate(() => {
        const results: any[] = [];
        document.querySelectorAll('.flight-card').forEach(card => {
          results.push({
            flightNumber: card.querySelector('.flight-number')?.textContent,
            departureTime: card.querySelector('.depart-time')?.textContent,
            arrivalTime: card.querySelector('.arrive-time')?.textContent,
            miles: card.querySelector('.miles-required')?.textContent,
            // ... extract other fields
          });
        });
        return results;
      });

      return flights.map(f => ({
        ...f,
        airline: 'UA',
        origin: params.origin,
        destination: params.destination,
        date: params.date,
      }));

    } finally {
      await page.close();
    }
  }
}
```

---

## 🔄 Background Job System

```typescript
// backend/src/jobs/scrape-queue.ts

import Queue from 'bull';
import { ScraperManager } from '../scrapers/manager';

const scrapeQueue = new Queue('flight-scraping', {
  redis: {
    host: 'localhost',
    port: 6379
  }
});

// Process jobs
scrapeQueue.process(async (job) => {
  const { airline, route, dateRange } = job.data;

  const scraper = ScraperManager.getScraper(airline);
  const flights = await scraper.search({
    origin: route.origin,
    destination: route.destination,
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  // Save to database
  await prisma.flight.createMany({ data: flights });

  return { flightsFound: flights.length };
});

// Schedule regular scraping
import cron from 'node-cron';

// Scrape popular routes every hour
cron.schedule('0 * * * *', async () => {
  const popularRoutes = await prisma.route.findMany({
    where: { isActive: true },
    take: 10
  });

  for (const route of popularRoutes) {
    await scrapeQueue.add({
      airline: route.airline,
      route: route,
      dateRange: {
        start: new Date(),
        end: addMonths(new Date(), 6)
      }
    });
  }
});
```

---

## 🛡️ Anti-Detection Measures

```typescript
// backend/src/utils/stealth.ts

export const stealthConfig = {
  // Rotate user agents
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
    // Add 20+ more
  ],

  // Randomize viewport
  viewports: [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
  ],

  // Request delays
  minDelay: 2000,  // 2 seconds
  maxDelay: 5000,  // 5 seconds

  // Max requests per IP per hour
  rateLimit: 100,
};

export function getRandomUserAgent(): string {
  return stealthConfig.userAgents[
    Math.floor(Math.random() * stealthConfig.userAgents.length)
  ];
}

export function getRandomViewport() {
  return stealthConfig.viewports[
    Math.floor(Math.random() * stealthConfig.viewports.length)
  ];
}
```

---

## 🚀 Quick Start Implementation

I'll create the initial backend structure for you now. Should I:

**A) Create full backend with all scrapers** (2-3 hours work)
- Complete Express API
- Database setup with Prisma
- British Airways scraper (simple)
- United scraper (complex)
- Job queue system
- Rate limiting

**B) Start with minimal viable scraper** (30 mins)
- Simple Express API
- One basic scraper (BA or dummy)
- Connect to frontend
- Prove the concept

**C) Just the architecture files** (10 mins)
- File structure
- Config files
- You implement the scrapers

Which approach do you prefer? Option B is fastest to get something working today.
