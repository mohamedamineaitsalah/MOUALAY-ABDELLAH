const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.post('/', protect, adminOnly, ctrl.create);
router.delete('/:id', protect, adminOnly, ctrl.deleteOne);

module.exports = router;
