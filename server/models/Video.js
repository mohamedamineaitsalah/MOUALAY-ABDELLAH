const pool = require('../config/db');
const Video = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM videos ORDER BY created_at DESC'); return rows; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO videos SET ?', [data]); return result.insertId; },
  delete: async (id) => { await pool.query('DELETE FROM videos WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM videos'); return rows[0].count; }
};
module.exports = Video;