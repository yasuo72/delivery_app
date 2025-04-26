const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Get all restaurants (with optional search)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};
    if (q) {
      filter = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { cuisines: { $regex: q, $options: 'i' } }
        ]
      };
    }
    const restaurants = await Restaurant.find(filter);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant by owner
router.get('/by-owner/:ownerId', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.params.ownerId });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// (Optional) Add a restaurant (for admin/testing)
router.post('/', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(400).json({ message: 'Could not add restaurant' });
  }
});

module.exports = router;
