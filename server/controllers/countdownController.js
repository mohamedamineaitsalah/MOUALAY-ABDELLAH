const Countdown = require('../models/Countdown');

exports.get = async (req, res, next) => {
  try {
    const countdown = await Countdown.get();
    res.json({ success: true, data: countdown });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const { festival_date } = req.body;
    if (!festival_date) return res.status(400).json({ success: false, message: 'festival_date is required' });
    await Countdown.upsert(festival_date);
    const updated = await Countdown.get();
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
};
