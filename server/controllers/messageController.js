const Message = require('../models/Message');

exports.getAll = async (req, res, next) => {
  try {
    const messages = await Message.findAll();
    res.json({ success: true, data: messages });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const id = await Message.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully', data: { id } });
  } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Message.markAsRead(req.params.id);
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) { next(error); }
};

exports.deleteOne = async (req, res, next) => {
  try {
    await Message.delete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) { next(error); }
};
