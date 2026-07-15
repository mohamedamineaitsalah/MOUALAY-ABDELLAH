const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');

router.get('/', protect, adminOnly, getStats);

module.exports = router;
