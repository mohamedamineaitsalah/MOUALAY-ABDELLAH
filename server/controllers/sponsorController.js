const Sponsor = require('../models/Sponsor');
const { deleteFile } = require('../utils/helpers');

exports.getAll = async (req, res, next) => {
  try {
    const sponsors = await Sponsor.findAll();
    res.json({ success: true, data: sponsors });
  } catch (error) { next(error); }
};

exports.getOne = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.json({ success: true, data: sponsor });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, website, facebook, instagram, twitter, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const data = {
      name, website, facebook, instagram, twitter, description,
      logo: req.file ? req.file.filename : null
    };
    const id = await Sponsor.create(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    const { name, website, facebook, instagram, twitter, description } = req.body;
    const data = { name, website, facebook, instagram, twitter, description };
    if (req.file) {
      deleteFile(sponsor.logo);
      data.logo = req.file.filename;
    }
    await Sponsor.update(req.params.id, data);
    res.json({ success: true, data: { id: req.params.id, ...data } });
  } catch (error) { next(error); }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    deleteFile(sponsor.logo);
    await Sponsor.delete(req.params.id);
    res.json({ success: true, message: 'Sponsor deleted' });
  } catch (error) { next(error); }
};
