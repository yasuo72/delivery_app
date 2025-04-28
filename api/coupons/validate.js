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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await dbConnect();
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid code' });
    if (coupon.expiry && new Date(coupon.expiry) < new Date()) return res.status(400).json({ valid: false, message: 'Coupon expired' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ valid: false, message: 'Usage limit reached' });
    if (orderTotal < coupon.minOrder) return res.status(400).json({ valid: false, message: `Order must be at least ₹${coupon.minOrder}` });
    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = Math.round(orderTotal * coupon.discountValue / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }
    res.json({ valid: true, discount, message: `Coupon applied! ₹${discount} off` });
  } catch (err) {
    res.status(400).json({ valid: false, message: 'Error validating coupon', error: err.message });
  }
}
