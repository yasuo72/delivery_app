const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: String,
  discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
  discountValue: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  expiry: { type: Date },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);
