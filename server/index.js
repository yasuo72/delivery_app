const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/swiggy_clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const addressRoutes = require('./routes/addresses');
const couponRoutes = require('./routes/coupons');

app.get('/', (req, res) => {
  res.send('Swiggy Clone Backend Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/coupons', couponRoutes);

// TODO: Add routes for etc.

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
