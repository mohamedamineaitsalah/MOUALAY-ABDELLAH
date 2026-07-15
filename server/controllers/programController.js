const Program = require('../models/Program');
const { deleteFile } = require('../utils/helpers');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Program.findAll();
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Program.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Program item not found' });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { title_ar, title_en, description_ar, description_en, event_date, event_time, location } = req.body;
    if (!title_ar || !title_en) return res.status(400).json({ success: false, message: 'Both Arabic and English titles are required' });
    const data = {
      title_ar, title_en, description_ar, description_en,
      event_date, event_time, location,
      image: req.file ? req.file.filename : null
    };
    const id = await Program.create(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Program.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Program item not found' });
    const { title_ar, title_en, description_ar, description_en, event_date, event_time, location } = req.body;
    const data = { title_ar, title_en, description_ar, description_en, event_date, event_time, location };
    if (req.file) {
      deleteFile(item.image);
      data.image = req.file.filename;
    }
    await Program.update(req.params.id, data);
    res.json({ success: true, data: { id: req.params.id, ...data } });
  } catch (error) { next(error); }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const item = await Program.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Program item not found' });
    deleteFile(item.image);
    await Program.delete(req.params.id);
    res.json({ success: true, message: 'Program item deleted' });
  } catch (error) { next(error); }
};

exports.getProgram = exports.getAll;
exports.createProgram = exports.create;
