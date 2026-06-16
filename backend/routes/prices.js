import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/**
 * POST /api/prices/feedback
 * Submit crowdsourced price feedback
 */
router.post('/feedback', (req, res) => {
  const { item_id, country_id, actual_price, user_rating, comment } = req.body;

  if (!item_id || !country_id) {
    return res.status(400).json({
      error: 'Missing required fields: item_id, country_id'
    });
  }

  db.run(
    `INSERT INTO user_feedback (item_id, country_id, actual_price, user_rating, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [item_id, country_id, actual_price || null, user_rating || null, comment || null],
    (err) => {
      if (err) {
        console.error('Error saving feedback:', err);
        res.status(500).json({ error: 'Failed to save feedback' });
      } else {
        res.json({ success: true, message: 'Feedback recorded successfully' });
      }
    }
  );
});

/**
 * GET /api/prices/feedback/stats/:item_id/:country_id
 * Get average feedback for an item in a country
 */
router.get('/feedback/stats/:item_id/:country_id', (req, res) => {
  const { item_id, country_id } = req.params;

  db.get(
    `SELECT 
      COUNT(*) as feedback_count,
      AVG(actual_price) as avg_price,
      AVG(user_rating) as avg_rating
     FROM user_feedback
     WHERE item_id = ? AND country_id = ?`,
    [item_id, country_id],
    (err, row) => {
      if (err) {
        console.error('Error fetching feedback stats:', err);
        res.status(500).json({ error: 'Failed to fetch feedback stats' });
      } else {
        res.json({ success: true, data: row });
      }
    }
  );
});

export default router;
