const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, ctrl.getAll);
router.get('/:id', protect, adminOnly, ctrl.getOne);
router.delete('/:id', protect, adminOnly, ctrl.deleteOne);

module.exports = router;
