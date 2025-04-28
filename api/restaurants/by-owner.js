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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await dbConnect();
  try {
    const { ownerId } = req.query;
    if (!ownerId) return res.status(400).json({ message: 'Missing ownerId' });
    const restaurant = await Restaurant.findOne({ owner: ownerId });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
