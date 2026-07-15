const pool = require('../config/db');
const News = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM news ORDER BY created_at DESC'); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]); return rows[0]; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO news SET ?', [data]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE news SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM news WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM news'); return rows[0].count; },
  search: async (query) => { const [rows] = await pool.query('SELECT * FROM news WHERE title_ar LIKE ? OR title_en LIKE ?', [`%${query}%`, `%${query}%`]); return rows; }
};
module.exports = News;
