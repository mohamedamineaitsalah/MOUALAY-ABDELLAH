const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const passport = require('passport');
const { handleGoogleCallback } = require('../services/googleAuth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }),
  handleGoogleCallback
);

module.exports = router;
