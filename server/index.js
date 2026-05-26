require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Connect to MongoDB
connectDB();

// Allow requests from the React frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// Register route handlers
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/check', require('./routes/check.routes'));
app.use('/api/history', require('./routes/history.routes'));

// Health check — visit this in browser to confirm server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TruthTrace server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});