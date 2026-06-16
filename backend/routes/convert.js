import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/**
 * POST /api/convert
 * Core conversion logic
 * Body: { source_country_id, dest_country_id, item_id }
 * Returns: { original_price, home_equivalent, ppp_ratio, expense_status, monthly_estimate }
 */
router.post('/', (req, res) => {
  const { source_country_id, dest_country_id, item_id } = req.body;

  // Validate input
  if (!source_country_id || !dest_country_id || !item_id) {
    return res.status(400).json({
      error: 'Missing required fields: source_country_id, dest_country_id, item_id'
    });
  }

  // Fetch source country data
  db.get(
    `SELECT * FROM countries WHERE id = ?`,
    [source_country_id],
    (err, sourceCountry) => {
      if (err || !sourceCountry) {
        return res.status(404).json({ error: 'Source country not found' });
      }

      // Fetch destination country data
      db.get(
        `SELECT * FROM countries WHERE id = ?`,
        [dest_country_id],
        (err, destCountry) => {
          if (err || !destCountry) {
            return res.status(404).json({ error: 'Destination country not found' });
          }

          // Fetch item data
          db.get(
            `SELECT * FROM items WHERE id = ?`,
            [item_id],
            (err, item) => {
              if (err || !item) {
                return res.status(404).json({ error: 'Item not found' });
              }

              // Fetch prices in both countries
              db.get(
                `SELECT p.price FROM prices p 
                 WHERE p.item_id = ? AND p.country_id = ?`,
                [item_id, source_country_id],
                (err, sourcePrice) => {
                  if (err || !sourcePrice) {
                    return res.status(404).json({
                      error: `Price for ${item.name} not available in ${sourceCountry.country_name}`
                    });
                  }

                  db.get(
                    `SELECT p.price FROM prices p 
                     WHERE p.item_id = ? AND p.country_id = ?`,
                    [item_id, dest_country_id],
                    (err, destPrice) => {
                      if (err || !destPrice) {
                        return res.status(404).json({
                          error: `Price for ${item.name} not available in ${destCountry.country_name}`
                        });
                      }

                      // PPP Conversion Logic
                      const destPriceInSourceCurrency = destPrice.price * destCountry.ppp_index / sourceCountry.ppp_index;
                      const pppRatio = destCountry.ppp_index / sourceCountry.ppp_index;
                      const percentageDifference = ((destPriceInSourceCurrency - sourcePrice.price) / sourcePrice.price) * 100;
                      const monthlyEstimate = destPriceInSourceCurrency * 30; // Monthly estimate

                      // Determine expense status
                      let expenseStatus = '⚪ Similar';
                      if (percentageDifference < -50) expenseStatus = '🟢 Very Cheap';
                      else if (percentageDifference < -20) expenseStatus = '🟡 Cheap';
                      else if (percentageDifference < 20) expenseStatus = '⚪ Similar';
                      else if (percentageDifference < 100) expenseStatus = '🟠 Expensive';
                      else expenseStatus = '🔴 Very Expensive';

                      res.json({
                        success: true,
                        data: {
                          item: item.name,
                          source_country: sourceCountry.country_name,
                          dest_country: destCountry.country_name,
                          original_price: destPrice.price,
                          original_currency: destCountry.currency_code,
                          home_equivalent_price: Math.round(destPriceInSourceCurrency * 100) / 100,
                          home_currency: sourceCountry.currency_code,
                          actual_home_price: sourcePrice.price,
                          percentage_difference: Math.round(percentageDifference * 100) / 100,
                          expense_status: expenseStatus,
                          monthly_estimate: Math.round(monthlyEstimate * 100) / 100,
                          ppp_ratio: Math.round(pppRatio * 100) / 100
                        }
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

export default router;
