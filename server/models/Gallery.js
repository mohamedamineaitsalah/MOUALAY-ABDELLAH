const pool = require('../config/db');
const Gallery = {
  findAll: async (category) => { 
    if(category && category !== 'all') {
      const [rows] = await pool.query('SELECT * FROM gallery WHERE category = ? ORDER BY created_at DESC', [category]); return rows; 
    }
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC'); return rows; 
  },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [id]); return rows[0]; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO gallery SET ?', [data]); return result.insertId; },
  delete: async (id) => { await pool.query('DELETE FROM gallery WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM gallery'); return rows[0].count; }
};
module.exports = Gallery;