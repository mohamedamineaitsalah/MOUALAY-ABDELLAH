const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'server');

const files = {
  // MODELS
  'models/Program.js': `const pool = require('../config/db');
const Program = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM festival_program ORDER BY event_date ASC, event_time ASC'); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM festival_program WHERE id = ?', [id]); return rows[0]; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO festival_program SET ?', [data]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE festival_program SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM festival_program WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM festival_program'); return rows[0].count; },
  findUpcoming: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM festival_program WHERE event_date >= CURDATE()'); return rows[0].count; }
};
module.exports = Program;`,

  'models/Participant.js': `const pool = require('../config/db');
const Participant = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM participants ORDER BY created_at DESC'); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM participants WHERE id = ?', [id]); return rows[0]; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO participants SET ?', [data]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE participants SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM participants WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM participants'); return rows[0].count; }
};
module.exports = Participant;`,

  'models/Sponsor.js': `const pool = require('../config/db');
const Sponsor = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM sponsors ORDER BY created_at DESC'); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM sponsors WHERE id = ?', [id]); return rows[0]; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO sponsors SET ?', [data]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE sponsors SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM sponsors WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM sponsors'); return rows[0].count; }
};
module.exports = Sponsor;`,

  'models/Gallery.js': `const pool = require('../config/db');
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
module.exports = Gallery;`,

  'models/Video.js': `const pool = require('../config/db');
const Video = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM videos ORDER BY created_at DESC'); return rows; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO videos SET ?', [data]); return result.insertId; },
  delete: async (id) => { await pool.query('DELETE FROM videos WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM videos'); return rows[0].count; }
};
module.exports = Video;`,

  // CONTROLLERS
  'controllers/programController.js': `const Program = require('../models/Program');
const { deleteFile } = require('../utils/helpers');

exports.getProgram = async (req, res, next) => {
  try {
    const data = await Program.findAll();
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

exports.createProgram = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;
    const id = await Program.create(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) { next(error); }
};
`,
  'controllers/dashboardController.js': `const User = require('../models/User');
const News = require('../models/News');
const Gallery = require('../models/Gallery');
const Video = require('../models/Video');
const Sponsor = require('../models/Sponsor');
const Participant = require('../models/Participant');
const Program = require('../models/Program');

exports.getStats = async (req, res, next) => {
  try {
    const [users, news, gallery, videos, sponsors, participants, upcomingEvents] = await Promise.all([
      User.count(), News.count(), Gallery.count(), Video.count(), Sponsor.count(), Participant.count(), Program.findUpcoming()
    ]);
    res.json({ success: true, data: { users, news, gallery, videos, sponsors, participants, upcomingEvents, unreadMessages: 0 } });
  } catch (error) { next(error); }
};
`,
  
  // ROUTES
  'routes/program.js': `const express = require('express');
const router = express.Router();
const { getProgram, createProgram } = require('../controllers/programController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProgram);
router.post('/', protect, adminOnly, upload.single('image'), createProgram);

module.exports = router;
`,
  'routes/dashboard.js': `const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getStats);
module.exports = router;
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filepath), content);
}
console.log('Backend scaffolding step 3 done.');
