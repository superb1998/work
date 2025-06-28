require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const walletRoutes = require('./routes/wallet');

const app = express();

// Middleware
app.use(helmet());

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://grovetoken-2.onrender.com'] // Your frontend static site URL
    : ['http://localhost:5173', 'http://localhost:3000'], // Local development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Routes
app.use('/api/wallet', walletRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Wallet backend running on port ${PORT}`);
});
