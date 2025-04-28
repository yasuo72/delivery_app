import mongoose from 'mongoose';
import Review from '../../../server/models/Review.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/delivery';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    try {
      const { restaurantId } = req.query;
      if (!restaurantId) return res.status(400).json({ message: 'Missing restaurantId' });
      const reviews = await Review.find({ restaurant: restaurantId }).populate('user', 'name');
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId, restaurantId, orderId, rating, comment } = req.body;
      const review = new Review({ user: userId, restaurant: restaurantId, order: orderId, rating, comment });
      await review.save();
      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ message: 'Could not add review', error: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
