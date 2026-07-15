const Setting = require('../models/Setting');

exports.getAll = async (req, res, next) => {
  try {
    const settings = await Setting.getMap();
    res.json({ success: true, data: settings });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const entries = req.body;
    if (!entries || typeof entries !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings format' });
    }
    for (const [key, value] of Object.entries(entries)) {
      await Setting.upsert(key, value);
    }
    const updated = await Setting.getMap();
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
};
