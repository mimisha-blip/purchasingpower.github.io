import express from 'express';
import { db } from '../server.js';
import { buildAdvisorInputFromCountries, buildTravelPriceAdvice } from '../utils/travelAdvisor.js';

const router = express.Router();

const ITEM_SEARCH_TERMS = [
  { patterns: ['lunch', 'dinner', 'meal', 'food'], term: 'meal' },
  { patterns: ['coffee', 'tea'], term: 'coffee' },
  { patterns: ['taxi', 'cab', 'ride', 'uber'], term: 'taxi' },
  { patterns: ['water'], term: 'water' },
  { patterns: ['snack'], term: 'snack' },
  { patterns: ['grocery', 'groceries'], term: 'groceries' },
  { patterns: ['transit', 'metro', 'bus', 'train'], term: 'transit' },
  { patterns: ['sim', 'data', 'mobile'], term: 'SIM' },
  { patterns: ['hotel', 'stay', 'room'], term: 'hotel' },
  { patterns: ['iphone', 'phone', 'smartphone'], term: 'phone' },
  { patterns: ['laptop', 'macbook', 'computer'], term: 'laptop' },
  { patterns: ['shoe', 'sneaker', 'clothes', 'clothing', 'shirt'], term: 'clothing' }
];

function resolveItemSearchTerm(item) {
  const normalized = item.toLowerCase();
  return ITEM_SEARCH_TERMS.find(({ patterns }) => patterns.some((pattern) => normalized.includes(pattern)))?.term || item;
}

function rangeAround(price) {
  return {
    min: Math.max(0, Math.round(price * 0.75 * 100) / 100),
    max: Math.round(price * 1.35 * 100) / 100
  };
}

function resolveRangesFromStoredPrices({ item, destinationCountryId, homeCountryId }, callback) {
  const term = resolveItemSearchTerm(item);

  db.get(
    `SELECT id, name
     FROM items
     WHERE LOWER(name) LIKE LOWER(?)
     ORDER BY LENGTH(name) ASC
     LIMIT 1`,
    [`%${term}%`],
    (itemErr, itemRow) => {
      if (itemErr || !itemRow) {
        return callback(itemErr, {});
      }

      db.all(
        `SELECT country_id, price
         FROM prices
         WHERE item_id = ? AND country_id IN (?, ?)`,
        [itemRow.id, destinationCountryId, homeCountryId],
        (priceErr, rows) => {
          if (priceErr) {
            return callback(priceErr, {});
          }

          const destinationPrice = rows.find((row) => row.country_id === destinationCountryId)?.price;
          const homePrice = rows.find((row) => row.country_id === homeCountryId)?.price;

          callback(null, {
            destinationTypicalRange: typeof destinationPrice === 'number' ? rangeAround(destinationPrice) : undefined,
            homeTypicalRange: typeof homePrice === 'number' ? rangeAround(homePrice) : undefined
          });
        }
      );
    }
  );
}

router.post('/price', (req, res) => {
  const {
    item,
    destination_country_id,
    home_country_id,
    destination_price,
    destination_city,
    destination_typical_min,
    destination_typical_max,
    home_typical_min,
    home_typical_max
  } = req.body;

  const requiredNumbers = {
    destination_country_id,
    home_country_id,
    destination_price,
  };

  const missingText = [
    ['item', item],
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

      resolveRangesFromStoredPrices({
        item,
        destinationCountryId: destination_country_id,
        homeCountryId: home_country_id
      }, (rangeErr, storedRanges) => {
        if (rangeErr) {
          console.error('Error resolving advisor ranges:', rangeErr);
        }

        const advisorInput = buildAdvisorInputFromCountries({
          item,
          destinationCountry,
          homeCountry,
          destinationPrice: destination_price,
          destinationCity: destination_city,
          destinationTypicalRange: typeof destination_typical_min === 'number' && typeof destination_typical_max === 'number'
            ? { min: destination_typical_min, max: destination_typical_max }
            : storedRanges.destinationTypicalRange,
          homeTypicalRange: typeof home_typical_min === 'number' && typeof home_typical_max === 'number'
            ? { min: home_typical_min, max: home_typical_max }
            : storedRanges.homeTypicalRange
        });
        const advice = buildTravelPriceAdvice(advisorInput);

        res.json({ success: true, data: { ...advice, exchange_rate: advisorInput.exchangeRate, affordability_score: advisorInput.affordabilityScore } });
      });
    });
  });
});

export default router;
