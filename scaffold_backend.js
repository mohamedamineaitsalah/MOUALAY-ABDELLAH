const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'server');
const dirs = [
  'config', 'controllers', 'database', 'middleware', 'models', 'routes', 'services', 'uploads', 'utils'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(baseDir, dir), { recursive: true });
});


const files = {
  'middleware/auth.js': `const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};
`,
  'middleware/upload.js': `const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, \`\${uuidv4()}\${path.extname(file.originalname)}\`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
`,
  'utils/helpers.js': `const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.generateToken = (id, role, expiresIn = process.env.JWT_EXPIRES_IN) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};

exports.deleteFile = (filename) => {
  if (!filename) return;
  const filepath = path.join(__dirname, '..', 'uploads', filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};
`,
  'models/User.js': `const pool = require('../config/db');
const User = {
  findAll: async () => { const [rows] = await pool.query('SELECT id, first_name, last_name, email, google_id, avatar, role, created_at FROM users WHERE role != ?', ['admin']); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]); return rows[0]; },
  findByEmail: async (email) => { const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]); return rows[0]; },
  findByGoogleId: async (googleId) => { const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId]); return rows[0]; },
  create: async (userData) => { const [result] = await pool.query('INSERT INTO users SET ?', [userData]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE users SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM users WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role != ?', ['admin']); return rows[0].count; },
  search: async (query) => { const [rows] = await pool.query('SELECT id, first_name, last_name, email, avatar, role, created_at FROM users WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) AND role != ?', [\`%\${query}%\`, \`%\${query}%\`, \`%\${query}%\`, 'admin']); return rows; }
};
module.exports = User;
`,
  'models/News.js': `const pool = require('../config/db');
const News = {
  findAll: async () => { const [rows] = await pool.query('SELECT * FROM news ORDER BY created_at DESC'); return rows; },
  findById: async (id) => { const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]); return rows[0]; },
  create: async (data) => { const [result] = await pool.query('INSERT INTO news SET ?', [data]); return result.insertId; },
  update: async (id, data) => { await pool.query('UPDATE news SET ? WHERE id = ?', [data, id]); },
  delete: async (id) => { await pool.query('DELETE FROM news WHERE id = ?', [id]); },
  count: async () => { const [rows] = await pool.query('SELECT COUNT(*) as count FROM news'); return rows[0].count; },
  search: async (query) => { const [rows] = await pool.query('SELECT * FROM news WHERE title_ar LIKE ? OR title_en LIKE ?', [\`%\${query}%\`, \`%\${query}%\`]); return rows; }
};
module.exports = News;
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filepath), content);
}
console.log('Backend scaffolding step 1 done.');
