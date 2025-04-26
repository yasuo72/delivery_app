const mongoose = require('mongoose');
const User = require('./server/models/User');
const Restaurant = require('./server/models/Restaurant');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/delivery');
  const users = await User.find({ role: 'restaurant' });

  for (const user of users) {
    // Try to find a restaurant matching the user's name (case-insensitive)
    const restaurant = await Restaurant.findOne({ owner: { $exists: false }, name: new RegExp(user.name, 'i') });
    if (restaurant) {
      restaurant.owner = user._id;
      await restaurant.save();
      console.log(`Linked restaurant "${restaurant.name}" to user "${user.name}"`);
    }
  }

  await mongoose.disconnect();
  console.log('Migration complete.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
