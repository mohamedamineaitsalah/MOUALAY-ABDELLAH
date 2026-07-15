const Video = require('../models/Video');

exports.getAll = async (req, res, next) => {
  try {
    const videos = await Video.findAll();
    res.json({ success: true, data: videos });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, youtube_url, thumbnail } = req.body;
    if (!title || !youtube_url) return res.status(400).json({ success: false, message: 'Title and YouTube URL are required' });
    const id = await Video.create({ title, youtube_url, thumbnail });
    res.status(201).json({ success: true, data: { id, title, youtube_url, thumbnail } });
  } catch (error) { next(error); }
};

exports.deleteOne = async (req, res, next) => {
  try {
    await Video.delete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) { next(error); }
};
