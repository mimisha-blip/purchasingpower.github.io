import express from 'express';
import { db } from '../server.js';
import { buildAdvisorInputFromCountries, buildTravelPriceAdvice } from '../utils/travelAdvisor.js';

const router = express.Router();

router.post('/price', (req, res) => {
  const {
    item,
    destination_city,
    destination_country_id,
    home_country_id,
    destination_price,
    destination_typical_min,
    destination_typical_max,
    home_typical_min,
    home_typical_max
  } = req.body;

  const requiredNumbers = {
    destination_country_id,
    home_country_id,
    destination_price,
    destination_typical_min,
    destination_typical_max,
    home_typical_min,
    home_typical_max
  };

  const missingText = [
    ['item', item],
    ['destination_city', destination_city]
  ].find(([, value]) => !value);

  if (missingText) {
    return res.status(400).json({ error: `Missing required field: ${missingText[0]}` });
  }

  const invalidNumber = Object.entries(requiredNumbers).find(([, value]) => typeof value !== 'number' || !Number.isFinite(value) || value < 0);
  if (invalidNumber) {
    return res.status(400).json({ error: `${invalidNumber[0]} must be a non-negative number` });
  }

  db.get(`SELECT * FROM countries WHERE id = ?`, [home_country_id], (err, homeCountry) => {
    if (err || !homeCountry) {
      return res.status(404).json({ error: 'Home country not found' });
    }

    db.get(`SELECT * FROM countries WHERE id = ?`, [destination_country_id], (err, destinationCountry) => {
      if (err || !destinationCountry) {
        return res.status(404).json({ error: 'Destination country not found' });
      }

      const advisorInput = buildAdvisorInputFromCountries({
        item,
        destinationCity: destination_city,
        destinationCountry,
        homeCountry,
        destinationPrice: destination_price,
        destinationTypicalRange: { min: destination_typical_min, max: destination_typical_max },
        homeTypicalRange: { min: home_typical_min, max: home_typical_max }
      });
      const advice = buildTravelPriceAdvice(advisorInput);

      res.json({ success: true, data: { ...advice, exchange_rate: advisorInput.exchangeRate, affordability_score: advisorInput.affordabilityScore } });
    });
  });
});

export default router;
