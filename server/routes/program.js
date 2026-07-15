const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/programController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', protect, adminOnly, upload.single('image'), ctrl.create);
router.put('/:id', protect, adminOnly, upload.single('image'), ctrl.update);
router.delete('/:id', protect, adminOnly, ctrl.deleteOne);

module.exports = router;
