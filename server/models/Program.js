const pool = require('../config/db');
const Program = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM festival_program ORDER BY event_date ASC, event_time ASC'); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM festival_program WHERE id = ?', [id]); return rows[0]; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO festival_program SET ?', [data]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE festival_program SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM festival_program WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM festival_program'); return rows[0].count; },
  findUpcoming: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM festival_program WHERE event_date >= CURDATE()'); return rows[0].count; }
};
module.exports = Program;