const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateToken } = require('../utils/helpers');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {

      let user = await User.findByGoogleId(profile.id);

      if (user) {
        return done(null, user);
      }

      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findByEmail(email);
        if (user) {
          await User.update(user.id, { google_id: profile.id, avatar: profile.photos?.[0]?.value });
          user = await User.findById(user.id);
          return done(null, user);
        }
      }

      const id = await User.create({
        first_name: profile.name?.givenName || profile.displayName,
        last_name: profile.name?.familyName || '',
        email: email || `google_${profile.id}@noemail.com`,
        google_id: profile.id,
        avatar: profile.photos?.[0]?.value,
        role: 'visitor',
      });

      user = await User.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const handleGoogleCallback = (req, res) => {
  const user = req.user;
  const token = generateToken(user.id, user.role);

  const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${clientURL}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    avatar: user.avatar
  }))}`);
};

module.exports = { passport, handleGoogleCallback };
