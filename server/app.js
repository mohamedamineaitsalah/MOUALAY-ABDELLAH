const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const { passport } = require('./services/googleAuth');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];
app.use(cors({
  origin: (origin, callback) => {

    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5000 });
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/users'));
app.use('/api/news', require('./routes/news'));
app.use('/api/program', require('./routes/program'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/participants', require('./routes/participants'));
app.use('/api/sponsors', require('./routes/sponsors'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/countdown', require('./routes/countdown'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use(errorHandler);

module.exports = app;
