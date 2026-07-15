const pool = require('../config/db');
const Sponsor = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM sponsors ORDER BY created_at DESC'); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM sponsors WHERE id = ?', [id]); return rows[0]; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO sponsors SET ?', [data]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE sponsors SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM sponsors WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM sponsors'); return rows[0].count; }
};
module.exports = Sponsor;