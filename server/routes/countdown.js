const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/countdownController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.get);
router.put('/', protect, adminOnly, ctrl.update);

module.exports = router;
