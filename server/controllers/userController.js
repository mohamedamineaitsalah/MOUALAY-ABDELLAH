const User = require('../models/User');

exports.getAll = async (req, res, next) => {
  try {
    const { q } = req.query;
    const users = q ? await User.search(q) : await User.findAll();
    res.json({ success: true, data: users });
  } catch (error) { next(error); }
};

exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    await User.delete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};
