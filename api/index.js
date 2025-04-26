const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/delivery';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Import routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/restaurants', require('../server/routes/restaurants'));
app.use('/api/menu', require('../server/routes/menu'));
app.use('/api/orders', require('../server/routes/orders'));
app.use('/api/addresses', require('../server/routes/addresses'));
app.use('/api/reviews', require('../server/routes/reviews'));
app.use('/api/coupons', require('../server/routes/coupons'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
