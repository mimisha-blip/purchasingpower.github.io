import express from 'express';
import { db } from '../server.js';
import { convertPrice, getIncomeStatus, resolvePrice, resolvePercentage } from '../utils/ppp.js';

const router = express.Router();

/**
 * POST /api/trip-planner/estimate
 * Body: {
 *   home_country_id, monthly_income,
 *   basket: [{ item_id, quantity }],
 *   candidate_country_ids?: number[]  // omit/empty = every country except home
 * }
 *
 * Prices a basket of items against every candidate destination country and
 * ranks them by how much of the user's monthly income the trip would cost.
 *
 * Runs exactly 3 queries total (countries, items, prices for the basket's
 * items across all countries) regardless of basket size or country count,
 * then aggregates in JS — avoids an N+1 query per country/item pair.
 */
router.post('/estimate', (req, res) => {
  const { home_country_id, monthly_income, basket, candidate_country_ids } = req.body;

  if (!home_country_id) {
    return res.status(400).json({ error: 'Missing required field: home_country_id' });
  }
  if (typeof monthly_income !== 'number' || monthly_income <= 0) {
    return res.status(400).json({ error: 'monthly_income must be a positive number' });
  }
  if (!Array.isArray(basket) || basket.length === 0) {
    return res.status(400).json({ error: 'basket must be a non-empty array of { item_id, quantity }' });
  }

  db.get(`SELECT * FROM countries WHERE id = ?`, [home_country_id], (err, homeCountry) => {
    if (err || !homeCountry) {
      return res.status(404).json({ error: 'Home country not found' });
    }

    const itemIds = [...new Set(basket.map((line) => line.item_id))];
    const itemPlaceholders = itemIds.map(() => '?').join(', ');

    db.all(`SELECT * FROM countries`, (err, allCountries) => {
      if (err) {
        console.error('Error fetching countries:', err);
        return res.status(500).json({ error: 'Failed to fetch countries' });
      }

      db.all(
        `SELECT * FROM items WHERE id IN (${itemPlaceholders})`,
        itemIds,
        (err, itemRows) => {
          if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).json({ error: 'Failed to fetch items' });
          }

          const itemsById = new Map(itemRows.map((item) => [item.id, item]));
          const missingItemId = itemIds.find((id) => !itemsById.has(id));
          if (missingItemId) {
            return res.status(404).json({ error: `Item ${missingItemId} not found` });
          }

          db.all(
            `SELECT p.item_id, p.country_id, p.price, c.ppp_index AS country_ppp_index
             FROM prices p
             JOIN countries c ON c.id = p.country_id
             WHERE p.item_id IN (${itemPlaceholders})`,
            itemIds,
            (err, priceRows) => {
              if (err) {
                console.error('Error fetching prices:', err);
                return res.status(500).json({ error: 'Failed to fetch prices' });
              }

              const pricesByItem = new Map();
              for (const id of itemIds) pricesByItem.set(id, []);
              for (const row of priceRows) pricesByItem.get(row.item_id).push(row);

              const unpricedItems = itemIds
                .filter((id) => pricesByItem.get(id).length === 0)
                .map((id) => ({
                  item_id: id,
                  name: itemsById.get(id).name,
                  reason: 'no_price_data_anywhere'
                }));

              const candidates = allCountries.filter((c) => {
                if (c.id === homeCountry.id) return false;
                if (Array.isArray(candidate_country_ids) && candidate_country_ids.length > 0) {
                  return candidate_country_ids.includes(c.id);
                }
                return true;
              });

              const destinations = candidates.map((country) => {
                let unitSubtotal = 0;
                const lineItems = [];

                // Pass 1: unit-priced items (per-instance price x quantity) — this
                // produces the subtotal that percentage-based fees apply to.
                for (const line of basket) {
                  const item = itemsById.get(line.item_id);
                  if (item.pricing_model !== 'unit') continue;

                  const knownPrices = pricesByItem.get(line.item_id);
                  const resolved = resolvePrice(knownPrices, country);
                  if (!resolved) continue; // already flagged in unpricedItems

                  unitSubtotal += resolved.price * line.quantity;
                  lineItems.push({
                    item_id: line.item_id,
                    name: item.name,
                    pricing_model: 'unit',
                    quantity: line.quantity,
                    unit_price_dest_currency: Math.round(resolved.price * 100) / 100,
                    line_total_dest_currency: Math.round(resolved.price * line.quantity * 100) / 100,
                    estimated: resolved.estimated,
                    source_country_id_for_estimate: resolved.sourceCountryId
                  });
                }

                // Pass 2: percentage-based fees (tipping, ATM/card fees, currency
                // markup) — each is its own % of the unit subtotal, not compounded.
                let feeTotal = 0;
                for (const line of basket) {
                  const item = itemsById.get(line.item_id);
                  if (item.pricing_model !== 'percentage') continue;

                  const knownRates = pricesByItem.get(line.item_id);
                  const resolved = resolvePercentage(knownRates, country);
                  if (!resolved) continue; // already flagged in unpricedItems

                  const feeAmount = unitSubtotal * (resolved.rate / 100);
                  feeTotal += feeAmount;
                  lineItems.push({
                    item_id: line.item_id,
                    name: item.name,
                    pricing_model: 'percentage',
                    rate_percent: resolved.rate,
                    line_total_dest_currency: Math.round(feeAmount * 100) / 100,
                    estimated: resolved.estimated,
                    source_country_id_for_estimate: resolved.sourceCountryId
                  });
                }

                const total = unitSubtotal + feeTotal;
                // Convert local-currency total to home currency using the real
                // market exchange rate, not the affordability index. The index
                // is used above to estimate missing local prices, while this
                // table shows what the basket costs at the exchange rate.
                const basketTotalHomeEquivalent = convertPrice(total, country.exchange_rate, homeCountry.exchange_rate);
                const pctOfIncome = (basketTotalHomeEquivalent / monthly_income) * 100;

                return {
                  country_id: country.id,
                  country_name: country.country_name,
                  currency_code: country.currency_code,
                  basket_total_dest_currency: Math.round(total * 100) / 100,
                  basket_total_home_equivalent: Math.round(basketTotalHomeEquivalent * 100) / 100,
                  pct_of_income: Math.round(pctOfIncome * 100) / 100,
                  income_status: getIncomeStatus(pctOfIncome),
                  line_items: lineItems
                };
              });

              destinations.sort((a, b) => a.pct_of_income - b.pct_of_income);

              res.json({
                success: true,
                data: {
                  home_country: {
                    id: homeCountry.id,
                    country_name: homeCountry.country_name,
                    currency_code: homeCountry.currency_code
                  },
                  monthly_income,
                  basket: basket.map((line) => ({
                    item_id: line.item_id,
                    name: itemsById.get(line.item_id).name,
                    quantity: line.quantity
                  })),
                  unpriced_items: unpricedItems,
                  destinations
                }
              });
            }
          );
        }
      );
    });
  });
});

export default router;
