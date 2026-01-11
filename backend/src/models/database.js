import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../data/flights.db');
const dbDir = dirname(dbPath);

// Ensure data directory exists
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS flights (
    id TEXT PRIMARY KEY,
    airline TEXT NOT NULL,
    flight_number TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    date TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration INTEGER NOT NULL,
    stops INTEGER NOT NULL,
    cabin_class TEXT NOT NULL,
    miles_required INTEGER NOT NULL,
    availability INTEGER NOT NULL,
    scraped_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_flights_route
    ON flights(origin, destination, date);

  CREATE INDEX IF NOT EXISTS idx_flights_airline
    ON flights(airline, date);

  CREATE INDEX IF NOT EXISTS idx_flights_scraped
    ON flights(scraped_at);

  CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    airline TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    last_scraped TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(origin, destination, airline)
  );

  CREATE TABLE IF NOT EXISTS scrape_jobs (
    id TEXT PRIMARY KEY,
    route_id TEXT,
    airline TEXT NOT NULL,
    status TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    started_at TEXT,
    completed_at TEXT,
    error TEXT,
    flights_found INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    date TEXT,
    cabin_class TEXT,
    max_miles INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Prepared statements
export const queries = {
  // Flights
  insertFlight: db.prepare(`
    INSERT OR REPLACE INTO flights
    (id, airline, flight_number, origin, destination, date, departure_time,
     arrival_time, duration, stops, cabin_class, miles_required, availability, scraped_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getFlights: db.prepare(`
    SELECT * FROM flights
    WHERE origin = ? AND destination = ?
    AND date >= ? AND date <= ?
    ORDER BY date ASC, miles_required ASC
  `),

  deleteOldFlights: db.prepare(`
    DELETE FROM flights
    WHERE date < date('now', '-1 day')
  `),

  // Routes
  insertRoute: db.prepare(`
    INSERT OR IGNORE INTO routes (id, origin, destination, airline)
    VALUES (?, ?, ?, ?)
  `),

  updateRouteScraped: db.prepare(`
    UPDATE routes SET last_scraped = ? WHERE id = ?
  `),

  getActiveRoutes: db.prepare(`
    SELECT * FROM routes WHERE is_active = 1
    ORDER BY last_scraped ASC NULLS FIRST
    LIMIT ?
  `),

  // Scrape jobs
  insertScrapeJob: db.prepare(`
    INSERT INTO scrape_jobs
    (id, route_id, airline, status, start_date, end_date, started_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  updateScrapeJob: db.prepare(`
    UPDATE scrape_jobs
    SET status = ?, completed_at = ?, error = ?, flights_found = ?
    WHERE id = ?
  `),

  // Alerts
  insertAlert: db.prepare(`
    INSERT INTO alerts (id, email, origin, destination, date, cabin_class, max_miles)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  getActiveAlerts: db.prepare(`
    SELECT * FROM alerts WHERE is_active = 1
  `),
};

export default db;
