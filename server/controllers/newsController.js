const News = require('../models/News');
const { deleteFile } = require('../utils/helpers');

exports.getAll = async (req, res, next) => {
  try {
    const { q } = req.query;
    const news = q ? await News.search(q) : await News.findAll();
    res.json({ success: true, data: news });
  } catch (error) { next(error); }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { title_ar, title_en, description_ar, description_en } = req.body;
    if (!title_ar || !title_en) return res.status(400).json({ success: false, message: 'Both Arabic and English titles are required' });
    const data = {
      title_ar, title_en, description_ar, description_en,
      image: req.file ? req.file.filename : null
    };
    const id = await News.create(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'News not found' });
    const { title_ar, title_en, description_ar, description_en } = req.body;
    const data = { title_ar, title_en, description_ar, description_en };
    if (req.file) {
      deleteFile(item.image);
      data.image = req.file.filename;
    }
    await News.update(req.params.id, data);
    res.json({ success: true, data: { id: req.params.id, ...data } });
  } catch (error) { next(error); }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'News not found' });
    deleteFile(item.image);
    await News.delete(req.params.id);
    res.json({ success: true, message: 'News deleted' });
  } catch (error) { next(error); }
};
