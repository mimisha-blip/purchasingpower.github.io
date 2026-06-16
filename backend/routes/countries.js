import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/**
 * GET /api/countries
 * Returns all countries with their PPP and exchange rate data
 */
router.get('/', (req, res) => {
  db.all(
    `SELECT id, country_code, country_name, currency_code, currency_symbol, 
            ppp_index, exchange_rate, region FROM countries ORDER BY country_name`,
    (err, rows) => {
      if (err) {
        console.error('Error fetching countries:', err);
        res.status(500).json({ error: 'Failed to fetch countries' });
      } else {
        res.json({ success: true, data: rows, total: rows.length });
      }
    }
  );
});

/**
 * GET /api/countries/:id
 * Returns a specific country by ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get(
    `SELECT * FROM countries WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error('Error fetching country:', err);
        res.status(500).json({ error: 'Failed to fetch country' });
      } else if (!row) {
        res.status(404).json({ error: 'Country not found' });
      } else {
        res.json({ success: true, data: row });
      }
    }
  );
});

/**
 * GET /api/countries/code/:code
 * Returns a specific country by country code (e.g., 'IN', 'US')
 */
router.get('/code/:code', (req, res) => {
  const { code } = req.params;
  db.get(
    `SELECT * FROM countries WHERE country_code = ?`,
    [code.toUpperCase()],
    (err, row) => {
      if (err) {
        console.error('Error fetching country:', err);
        res.status(500).json({ error: 'Failed to fetch country' });
      } else if (!row) {
        res.status(404).json({ error: 'Country not found' });
      } else {
        res.json({ success: true, data: row });
      }
    }
  );
});

export default router;
