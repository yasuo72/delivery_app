const express = require('express');
const router = express.Router();
const Address = require('../models/Address');

// Get all addresses for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.params.userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new address
router.post('/', async (req, res) => {
  try {
    const { userId, label, addressLine, city, state, pincode, phone } = req.body;
    const address = new Address({ user: userId, label, addressLine, city, state, pincode, phone });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: 'Could not add address' });
  }
});

// Delete an address
router.delete('/:addressId', async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.addressId);
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Could not delete address' });
  }
});

module.exports = router;
