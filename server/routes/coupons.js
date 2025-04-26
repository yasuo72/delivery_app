const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Validate coupon code
router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid code' });
    if (coupon.expiry && new Date(coupon.expiry) < new Date()) return res.status(400).json({ valid: false, message: 'Coupon expired' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ valid: false, message: 'Usage limit reached' });
    if (orderTotal < coupon.minOrder) return res.status(400).json({ valid: false, message: `Order must be at least ₹${coupon.minOrder}` });
    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = Math.round(orderTotal * coupon.discountValue / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }
    res.json({ valid: true, discount, message: `Coupon applied! ₹${discount} off` });
  } catch (err) {
    res.status(400).json({ valid: false, message: 'Error validating coupon' });
  }
});

// Create a new coupon (admin only)
router.post('/', async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrder, maxDiscount, expiry, usageLimit } = req.body;
    const coupon = new Coupon({ code, description, discountType, discountValue, minOrder, maxDiscount, expiry, usageLimit });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: 'Could not create coupon' });
  }
});

module.exports = router;
