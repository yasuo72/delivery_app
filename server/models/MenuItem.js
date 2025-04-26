const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  isVeg: { type: Boolean, default: true },
  category: String
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
