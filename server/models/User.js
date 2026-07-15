const pool = require('../config/db');
const User = {
  findAll: async () => { const [rows] = await pool.query('SELECT id, first_name, last_name, email, google_id, avatar, role, created_at FROM users WHERE role != ?', ['admin']); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]); return rows[0]; },
  findByEmail: async (email) => { const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]); return rows[0]; },
  findByGoogleId: async (googleId) => { const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId]); return rows[0]; },
  create: async (userData) => { const [result] = await pool.query('INSERT INTO users SET ?', [userData]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE users SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM users WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role != ?', ['admin']); return rows[0].count; },
  search: async (query) => { const [rows] = await pool.query('SELECT id, first_name, last_name, email, avatar, role, created_at FROM users WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) AND role != ?', [`%${query}%`, `%${query}%`, `%${query}%`, 'admin']); return rows; }
};
module.exports = User;
