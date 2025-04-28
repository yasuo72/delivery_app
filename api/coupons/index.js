import mongoose from 'mongoose';
import Coupon from '../../../server/models/Coupon.js';

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
      const coupons = await Coupon.find();
      res.json(coupons);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { code, description, discountType, discountValue, minOrder, maxDiscount, expiry, usageLimit } = req.body;
      const coupon = new Coupon({ code, description, discountType, discountValue, minOrder, maxDiscount, expiry, usageLimit });
      await coupon.save();
      res.status(201).json(coupon);
    } catch (err) {
      res.status(400).json({ message: 'Could not create coupon', error: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
