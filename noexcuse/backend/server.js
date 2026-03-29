require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/habits',      require('./routes/habits'));
app.use('/api/logs',        require('./routes/logs'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/social',      require('./routes/social'));
app.use('/api/messages',    require('./routes/messages'));
app.use('/api/ai',          require('./routes/ai'));
app.use('/api/plans',       require('./routes/plans'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'OK', app: 'NoExcuse.ai', version: '2.0.0' }));

// Start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 NoExcuse.ai server → port ${PORT}`));

    // Start cron jobs if available
    const cron = require('./cron/dailyJob');
    if (cron?.start) cron.start();
  } catch (err) {
    console.error('❌ Startup error:', err.message);
    process.exit(1);
  }
}

startServer();