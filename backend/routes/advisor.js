import express from 'express';
import { buildTravelPriceAdvice } from '../utils/travelAdvisor.js';

const router = express.Router();

router.post('/price', (req, res) => {
  const {
    item,
    destination_city,
    destination_country,
    home_country,
    destination_currency,
    destination_price,
    home_currency,
    exchange_rate,
    affordability_score,
    destination_typical_min,
    destination_typical_max,
    home_typical_min,
    home_typical_max
  } = req.body;

  const requiredNumbers = {
    destination_price,
    exchange_rate,
    affordability_score,
    destination_typical_min,
    destination_typical_max,
    home_typical_min,
    home_typical_max
  };

  const missingText = [
    ['item', item],
    ['destination_city', destination_city],
    ['destination_country', destination_country],
    ['home_country', home_country],
    ['destination_currency', destination_currency],
    ['home_currency', home_currency]
  ].find(([, value]) => !value);

  if (missingText) {
    return res.status(400).json({ error: `Missing required field: ${missingText[0]}` });
  }

  const invalidNumber = Object.entries(requiredNumbers).find(([, value]) => typeof value !== 'number' || value < 0);
  if (invalidNumber) {
    return res.status(400).json({ error: `${invalidNumber[0]} must be a non-negative number` });
  }

  const advice = buildTravelPriceAdvice({
    item,
    destinationCity: destination_city,
    destinationCountry: destination_country,
    homeCountry: home_country,
    destinationCurrency: destination_currency,
    destinationPrice: destination_price,
    homeCurrency: home_currency,
    exchangeRate: exchange_rate,
    affordabilityScore: affordability_score,
    destinationTypicalRange: { min: destination_typical_min, max: destination_typical_max },
    homeTypicalRange: { min: home_typical_min, max: home_typical_max }
  });

  res.json({ success: true, data: advice });
});

export default router;
