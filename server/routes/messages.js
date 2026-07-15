const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/messageController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', ctrl.create);

router.get('/', protect, adminOnly, ctrl.getAll);

router.patch('/:id/read', protect, adminOnly, ctrl.markAsRead);

router.delete('/:id', protect, adminOnly, ctrl.deleteOne);

module.exports = router;
