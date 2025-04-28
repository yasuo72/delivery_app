import mongoose from 'mongoose';
import Restaurant from '../../../server/models/Restaurant.js';

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
      const { q } = req.query;
      let filter = {};
      if (q) {
        filter = {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { cuisines: { $regex: q, $options: 'i' } }
          ]
        };
      }
      const restaurants = await Restaurant.find(filter);
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const restaurant = new Restaurant(req.body);
      await restaurant.save();
      res.status(201).json(restaurant);
    } catch (err) {
      res.status(400).json({ message: 'Could not add restaurant', error: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
