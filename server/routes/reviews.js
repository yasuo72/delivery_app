const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get reviews for a restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a review
router.post('/', async (req, res) => {
  try {
    const { userId, restaurantId, orderId, rating, comment } = req.body;
    const review = new Review({ user: userId, restaurant: restaurantId, order: orderId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: 'Could not add review' });
  }
});

module.exports = router;
