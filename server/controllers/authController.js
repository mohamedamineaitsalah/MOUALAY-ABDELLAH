const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/helpers');

exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
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
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findByEmail(email);
    if (!user || !user.password) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user.id, user.role);
    res.json({
      success: true, token,
      user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) { next(error); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, email, current_password, new_password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email && email !== user.email) {
      const existing = await User.findByEmail(email);
      if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
      updateData.email = email;
    }
    if (req.file) updateData.avatar = req.file.filename;

    if (new_password) {
      if (!current_password) return res.status(400).json({ success: false, message: 'Current password required' });
      if (!user.password) return res.status(400).json({ success: false, message: 'Cannot change password for OAuth accounts' });
      const isMatch = await bcrypt.compare(current_password, user.password);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      updateData.password = await bcrypt.hash(new_password, 10);
    }

    await User.update(req.user.id, updateData);
    const updated = await User.findById(req.user.id);
    const { password, ...safeUser } = updated;
    res.json({ success: true, data: safeUser });
  } catch (error) { next(error); }
};
