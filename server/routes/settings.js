const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.put('/', protect, adminOnly, ctrl.update);

module.exports = router;
