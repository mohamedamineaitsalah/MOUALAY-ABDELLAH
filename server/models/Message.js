const pool = require('../config/db');

const Message = {
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [id]);
    return rows[0];
  },
  create: async (data) => {
    const [result] = await pool.query('INSERT INTO messages SET ?', [data]);
    return result.insertId;
  },
  markAsRead: async (id) => {
    await pool.query('UPDATE messages SET is_read = TRUE WHERE id = ?', [id]);
  },
  delete: async (id) => {
    await pool.query('DELETE FROM messages WHERE id = ?', [id]);
  },
  countUnread: async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM messages WHERE is_read = FALSE');
    return rows[0].count;
  },
  count: async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM messages');
    return rows[0].count;
  }
};

module.exports = Message;
