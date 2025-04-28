import mongoose from 'mongoose';
import Address from '../../../server/models/Address.js';

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
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ message: 'Missing userId' });
      const addresses = await Address.find({ user: userId });
      res.json(addresses);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId, label, addressLine, city, state, pincode, phone } = req.body;
      const address = new Address({ user: userId, label, addressLine, city, state, pincode, phone });
      await address.save();
      res.status(201).json(address);
    } catch (err) {
      res.status(400).json({ message: 'Could not add address', error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { addressId } = req.query;
      if (!addressId) return res.status(400).json({ message: 'Missing addressId' });
      await Address.findByIdAndDelete(addressId);
      res.json({ message: 'Address deleted' });
    } catch (err) {
      res.status(400).json({ message: 'Could not delete address', error: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
