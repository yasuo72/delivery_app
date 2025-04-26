const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, default: 'Home' },
  addressLine: { type: String, required: true },
  city: String,
  state: String,
  pincode: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Address', addressSchema);
