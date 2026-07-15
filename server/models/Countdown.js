const pool = require('../config/db');

const Countdown = {
  get: async () => {
    const [rows] = await pool.query('SELECT * FROM countdown ORDER BY id DESC LIMIT 1');
    return rows[0];
  },
  upsert: async (festival_date) => {
    const [existing] = await pool.query('SELECT id FROM countdown LIMIT 1');
    if (existing.length > 0) {
      await pool.query('UPDATE countdown SET festival_date = ? WHERE id = ?', [festival_date, existing[0].id]);
    } else {
      await pool.query('INSERT INTO countdown (festival_date) VALUES (?)', [festival_date]);
    }
  }
};

module.exports = Countdown;
