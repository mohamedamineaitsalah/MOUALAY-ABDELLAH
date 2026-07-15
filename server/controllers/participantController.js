const Participant = require('../models/Participant');
const { deleteFile } = require('../utils/helpers');

exports.getAll = async (req, res, next) => {
  try {
    const participants = await Participant.findAll();
    res.json({ success: true, data: participants });
  } catch (error) { next(error); }
};

exports.getOne = async (req, res, next) => {
  try {
    const p = await Participant.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Participant not found' });
    res.json({ success: true, data: p });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { 
      name, name_ar, name_en, 
      city, city_ar, city_en, 
      description, description_ar, description_en, 
      achievements, achievements_ar, achievements_en 
    } = req.body;

    const final_name = name || name_en || name_ar || '';
    if (!final_name) return res.status(400).json({ success: false, message: 'Name is required' });

    const data = {
      name: final_name,
      name_ar: name_ar || final_name,
      name_en: name_en || final_name,
      city: city || city_en || city_ar || '',
      city_ar: city_ar || city || '',
      city_en: city_en || city || '',
      description_ar: description_ar || description || '',
      description_en: description_en || description || '',
      achievements: achievements || achievements_en || achievements_ar || '',
      achievements_ar: achievements_ar || achievements || '',
      achievements_en: achievements_en || achievements || '',
      photo: req.file ? req.file.filename : null
    };
    const id = await Participant.create(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const p = await Participant.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Participant not found' });
    
    const { 
      name, name_ar, name_en, 
      city, city_ar, city_en, 
      description, description_ar, description_en, 
      achievements, achievements_ar, achievements_en 
    } = req.body;

    const final_name = name || name_en || name_ar || p.name;

    const data = {
      name: final_name,
      name_ar: name_ar || p.name_ar || final_name,
      name_en: name_en || p.name_en || final_name,
      city: city || city_en || city_ar || p.city || '',
      city_ar: city_ar || p.city_ar || city || '',
      city_en: city_en || p.city_en || city || '',
      description_ar: description_ar || description || p.description_ar || '',
      description_en: description_en || description || p.description_en || '',
      achievements: achievements || achievements_en || achievements_ar || p.achievements || '',
      achievements_ar: achievements_ar || p.achievements_ar || achievements || '',
      achievements_en: achievements_en || p.achievements_en || achievements || ''
    };
    if (req.file) {
      deleteFile(p.photo);
      data.photo = req.file.filename;
    }
    await Participant.update(req.params.id, data);
    res.json({ success: true, data: { id: req.params.id, ...data } });
  } catch (error) { next(error); }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const p = await Participant.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Participant not found' });
    deleteFile(p.photo);
    await Participant.delete(req.params.id);
    res.json({ success: true, message: 'Participant deleted' });
  } catch (error) { next(error); }
};
