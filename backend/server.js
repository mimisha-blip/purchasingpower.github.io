import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { initializeDatabase } from './database/schema.js';
import countriesRoutes from './routes/countries.js';
import itemsRoutes from './routes/items.js';
import pricesRoutes from './routes/prices.js';
import tripPlannerRoutes from './routes/tripPlanner.js';
import advisorRoutes from './routes/advisor.js';
import relocationRoutes from './routes/relocation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// Database initialization
export const db = new sqlite3.Database(process.env.DATABASE_PATH || './data/ppp_converter.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase(db);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Purchase Parity Converter API is running' });
});

// Routes
app.use('/api/countries', countriesRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/trip-planner', tripPlannerRoutes);
app.use('/api/advisor', advisorRoutes);
app.use('/api/relocation', relocationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
