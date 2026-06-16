import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/**
 * GET /api/items
 * Returns all items, optionally filtered by category
 * Query params: ?category=Food or ?search=bread
 */
router.get('/', (req, res) => {
  const { category, search } = req.query;
  
  let query = `SELECT * FROM items WHERE 1=1`;
  let params = [];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  if (search) {
    query += ` AND (name LIKE ? OR description LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ` ORDER BY group_name, category, name`;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching items:', err);
      res.status(500).json({ error: 'Failed to fetch items' });
    } else {
      res.json({ success: true, data: rows, total: rows.length });
    }
  });
});

/**
 * GET /api/items/:id
 * Returns a specific item with prices in all countries
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT * FROM items WHERE id = ?`,
    [id],
    (err, item) => {
      if (err) {
        console.error('Error fetching item:', err);
        res.status(500).json({ error: 'Failed to fetch item' });
      } else if (!item) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        // Get prices for this item across all countries
        db.all(
          `SELECT p.id, p.price, p.currency_code, c.country_name, c.country_code 
           FROM prices p
           JOIN countries c ON p.country_id = c.id
           WHERE p.item_id = ?
           ORDER BY c.country_name`,
          [id],
          (err, prices) => {
            if (err) {
              console.error('Error fetching prices:', err);
              res.status(500).json({ error: 'Failed to fetch prices' });
            } else {
              res.json({
                success: true,
                data: {
                  ...item,
                  prices: prices
                }
              });
            }
          }
        );
      }
    }
  );
});

/**
 * GET /api/items/category/list
 * Returns all available categories
 */
router.get('/category/list', (req, res) => {
  db.all(
    `SELECT DISTINCT category FROM items ORDER BY category`,
    (err, rows) => {
      if (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
      } else {
        const categories = rows.map(row => row.category);
        res.json({ success: true, data: categories, total: categories.length });
      }
    }
  );
});

export default router;
