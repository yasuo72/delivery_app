const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get menu for a restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get menu for a specific restaurant (for restaurant dashboard)
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add menu item (with image as base64 string)
router.post('/', async (req, res) => {
  try {
    const { name, price, image, restaurantId } = req.body;
    const item = new MenuItem({ name, price, image, restaurant: restaurantId });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Could not add menu item' });
  }
});

module.exports = router;
