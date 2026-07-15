const pool = require('../config/db');
const Participant = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM participants ORDER BY created_at DESC'); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM participants WHERE id = ?', [id]); return rows[0]; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO participants SET ?', [data]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE participants SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM participants WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM participants'); return rows[0].count; }
};
module.exports = Participant;