const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'server');

const files = {
  'controllers/authController.js': `const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/helpers');

exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const id = await User.create({ first_name, last_name, email, password: hashedPassword, role: 'visitor' });
    const token = generateToken(id, 'visitor');
    
    res.status(201).json({ success: true, token, user: { id, first_name, last_name, email, role: 'visitor' } });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !user.password) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const token = generateToken(user.id, user.role);
    res.json({ success: true, token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};
`,
  'routes/auth.js': `const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
`,
  'routes/news.js': `const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const news = await News.findAll();
    res.json({ success: true, data: news });
  } catch (error) { next(error); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const id = await News.create(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) { next(error); }
});

module.exports = router;
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filepath), content);
}
console.log('Backend scaffolding step 2 done.');
