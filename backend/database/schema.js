/**
 * Database Schema for PPP Converter
 * Creates all necessary tables on application startup
 */

export function initializeDatabase(db) {
  // Countries table
  db.run(`
    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country_code TEXT UNIQUE NOT NULL,
      country_name TEXT NOT NULL,
      currency_code TEXT NOT NULL,
      currency_symbol TEXT,
      ppp_index REAL NOT NULL,
      exchange_rate REAL NOT NULL,
      region TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Items table
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Prices table (stores price for each item in each country)
  db.run(`
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      country_id INTEGER NOT NULL,
      price REAL NOT NULL,
      currency_code TEXT NOT NULL,
      source TEXT DEFAULT 'manual',
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES items(id),
      FOREIGN KEY (country_id) REFERENCES countries(id),
      UNIQUE(item_id, country_id)
    )
  `);

  // User feedback (for crowdsourcing future)
  db.run(`
    CREATE TABLE IF NOT EXISTS user_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      country_id INTEGER NOT NULL,
      actual_price REAL,
      user_rating INTEGER,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES items(id),
      FOREIGN KEY (country_id) REFERENCES countries(id)
    )
  `);

  console.log('✅ Database schema initialized');
}
