const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');

// DB readiness check for incoming API requests
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/api/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is still initializing, please try again in a few seconds.',
    });
  }
  next();
});

// Serve uploaded files locally (when Cloudinary not configured)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/students',      require('./routes/studentRoutes'));
app.use('/api/skills',        require('./routes/skillRoutes'));
app.use('/api/certificates',  require('./routes/certificateRoutes'));
app.use('/api/competitions',  require('./routes/competitionRoutes'));
app.use('/api/verify',        require('./routes/verificationRoutes'));
app.use('/api/feedback',      require('./routes/feedbackRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/leaderboard',   require('./routes/leaderboardRoutes'));
app.use('/api/resources',     require('./routes/resourceRoutes'));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
