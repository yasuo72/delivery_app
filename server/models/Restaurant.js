const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  cuisines: [String],
  rating: { type: Number, default: 4 },
  deliveryTime: { type: Number, default: 30 },
  address: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
