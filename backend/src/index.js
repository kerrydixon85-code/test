import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flightsRouter from './routes/flights.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/flights', flightsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'AirMiles Flight Search API',
    version: '1.0.0',
    endpoints: {
      search: 'POST /api/flights/search',
      getFlights: 'GET /api/flights',
      health: 'GET /health'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 AirMiles Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized`);
  console.log(`\nEndpoints:`);
  console.log(`  POST http://localhost:${PORT}/api/flights/search`);
  console.log(`  GET  http://localhost:${PORT}/api/flights`);
  console.log(`  GET  http://localhost:${PORT}/health\n`);
});

export default app;
