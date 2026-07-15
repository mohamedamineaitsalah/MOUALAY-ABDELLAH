const pool = require('../config/db');

const Setting = {
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM settings');
    return rows;
  },
  findByKey: async (key) => {
    const [rows] = await pool.query('SELECT * FROM settings WHERE site_key = ?', [key]);
    return rows[0];
  },
  upsert: async (key, value) => {
    await pool.query(
      'INSERT INTO settings (site_key, site_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE site_value = ?',
      [key, value, value]
    );
  },
  getMap: async () => {
    const [rows] = await pool.query('SELECT site_key, site_value FROM settings');
    return rows.reduce((acc, row) => {
      acc[row.site_key] = row.site_value;
      return acc;
    }, {});
  }
};

module.exports = Setting;
