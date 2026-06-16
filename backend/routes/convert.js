import express from 'express';
import { db } from '../server.js';
import { convertPrice, getExpenseStatus, resolvePrice } from '../utils/ppp.js';

const router = express.Router();

/**
 * POST /api/convert
 * Core conversion logic
 * Body: { source_country_id, dest_country_id, item_id }
 * Returns: { original_price, home_equivalent, ppp_ratio, expense_status, monthly_estimate }
 *
 * If the item has no direct price row for a country, its price is
 * PPP-scaled from whichever country does have one (same fallback the trip
 * planner uses) — only fails if the item has no price data anywhere.
 */
router.post('/', (req, res) => {
  const { source_country_id, dest_country_id, item_id } = req.body;

  if (!source_country_id || !dest_country_id || !item_id) {
    return res.status(400).json({
      error: 'Missing required fields: source_country_id, dest_country_id, item_id'
    });
  }

  db.get(`SELECT * FROM countries WHERE id = ?`, [source_country_id], (err, sourceCountry) => {
    if (err || !sourceCountry) {
      return res.status(404).json({ error: 'Source country not found' });
    }

    db.get(`SELECT * FROM countries WHERE id = ?`, [dest_country_id], (err, destCountry) => {
      if (err || !destCountry) {
        return res.status(404).json({ error: 'Destination country not found' });
      }

      db.get(`SELECT * FROM items WHERE id = ?`, [item_id], (err, item) => {
        if (err || !item) {
          return res.status(404).json({ error: 'Item not found' });
        }
        if (item.pricing_model !== 'unit') {
          return res.status(400).json({
            error: `${item.name} is a percentage-based fee, not a per-unit price — use the Trip Planner to estimate its impact instead.`
          });
        }

        db.all(
          `SELECT p.country_id, p.price, c.ppp_index AS country_ppp_index
           FROM prices p
           JOIN countries c ON c.id = p.country_id
           WHERE p.item_id = ?`,
          [item_id],
          (err, knownPrices) => {
            if (err) {
              console.error('Error fetching prices:', err);
              return res.status(500).json({ error: 'Failed to fetch prices' });
            }
            if (knownPrices.length === 0) {
              return res.status(404).json({
                error: `No price data available for ${item.name} in any country`
              });
            }

            const sourceResolved = resolvePrice(knownPrices, sourceCountry);
            const destResolved = resolvePrice(knownPrices, destCountry);

            // PPP Conversion Logic
            const destPriceInSourceCurrency = convertPrice(destResolved.price, destCountry.ppp_index, sourceCountry.ppp_index);
            const pppRatio = destCountry.ppp_index / sourceCountry.ppp_index;
            const percentageDifference = ((destPriceInSourceCurrency - sourceResolved.price) / sourceResolved.price) * 100;
            const monthlyEstimate = destPriceInSourceCurrency * 30; // Monthly estimate
            const expenseStatus = getExpenseStatus(percentageDifference);

            res.json({
              success: true,
              data: {
                item: item.name,
                source_country: sourceCountry.country_name,
                source_country_code: sourceCountry.country_code,
                dest_country: destCountry.country_name,
                dest_country_code: destCountry.country_code,
                original_price: Math.round(destResolved.price * 100) / 100,
                original_price_estimated: destResolved.estimated,
                original_currency: destCountry.currency_code,
                home_equivalent_price: Math.round(destPriceInSourceCurrency * 100) / 100,
                home_currency: sourceCountry.currency_code,
                actual_home_price: Math.round(sourceResolved.price * 100) / 100,
                actual_home_price_estimated: sourceResolved.estimated,
                percentage_difference: Math.round(percentageDifference * 100) / 100,
                expense_status: expenseStatus,
                monthly_estimate: Math.round(monthlyEstimate * 100) / 100,
                ppp_ratio: Math.round(pppRatio * 100) / 100
              }
            });
          }
        );
      });
    });
  });
});

export default router;
