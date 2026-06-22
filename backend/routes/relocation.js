import express from 'express';
import { db } from '../server.js';
import { availableRelocationCities, buildRelocationEstimate } from '../utils/relocationAdvisor.js';

const router = express.Router();

router.get('/cities', (req, res) => {
  res.json({ success: true, data: availableRelocationCities() });
});

router.post('/estimate', (req, res) => {
  const { origin_country_id, destination_city, lifestyle_level } = req.body;

  if (typeof origin_country_id !== 'number' || !Number.isFinite(origin_country_id)) {
    return res.status(400).json({ error: 'origin_country_id must be a number' });
  }

  if (!destination_city) {
    return res.status(400).json({ error: 'Missing required field: destination_city' });
  }

  db.get(`SELECT * FROM countries WHERE id = ?`, [origin_country_id], (err, originCountry) => {
    if (err || !originCountry) {
      return res.status(404).json({ error: 'Origin country not found' });
    }

    try {
      const estimate = buildRelocationEstimate({
        originCountry,
        destinationCity: destination_city,
        lifestyleLevel: lifestyle_level || 'average'
      });

      res.json({ success: true, data: estimate });
    } catch (estimateErr) {
      res.status(404).json({ error: estimateErr.message });
    }
  });
});

export default router;
