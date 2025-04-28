import mongoose from 'mongoose';
import Order from '../../../server/models/Order.js';

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
  if (req.method === 'POST') {
    try {
      const { userId, restaurantId, items, total } = req.body;
      const order = new Order({
        user: userId,
        restaurant: restaurantId,
        items,
        total
      });
      await order.save();
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ message: 'Could not place order', error: err.message });
    }
  } else if (req.method === 'GET') {
    // Optionally implement fetching all orders for admin
    try {
      const orders = await Order.find().populate('restaurant user').sort({ createdAt: -1 });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
