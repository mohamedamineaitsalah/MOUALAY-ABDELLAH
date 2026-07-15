const Gallery = require('../models/Gallery');
const { deleteFile } = require('../utils/helpers');

exports.getAll = async (req, res, next) => {
  try {
    const { category } = req.query;
    const items = await Gallery.findAll(category);
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    const { category, title_ar, title_en } = req.body;
    const data = { image: req.file.filename, category: category || 'general', title_ar, title_en };
    const id = await Gallery.create(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) { next(error); }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    deleteFile(item.image);
    await Gallery.delete(req.params.id);
    res.json({ success: true, message: 'Photo deleted' });
  } catch (error) { next(error); }
};
