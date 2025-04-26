const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// Place an order
router.post('/', async (req, res) => {
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
    res.status(400).json({ message: 'Could not place order' });
  }
});

// Get order history for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('restaurant').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (for admin/delivery dashboard)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().populate('restaurant user').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders assigned to a delivery partner
router.get('/delivery/:deliveryPartnerId', async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.params.deliveryPartnerId })
      .populate('restaurant user')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// (Optional) Update order status (for admin/delivery)
router.patch('/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Could not update order' });
  }
});

// Assign or update delivery partner for an order (admin or restaurant)
router.patch('/:orderId/assign', async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { deliveryPartner: deliveryPartnerId },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Could not assign delivery partner' });
  }
});

module.exports = router;
