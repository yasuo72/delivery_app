const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/swiggy_clone';

const sampleRestaurants = [
  {
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    cuisines: ['Pizza', 'Italian', 'Fast Food'],
    rating: 4.5,
    deliveryTime: 30,
    address: '123 Main St, City Center'
  },
  {
    name: 'Biryani Hub',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    cuisines: ['Biryani', 'Indian', 'Hyderabadi'],
    rating: 4.7,
    deliveryTime: 40,
    address: '45 Spice Road, Old Town'
  },
  {
    name: 'Burger World',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    cuisines: ['Burger', 'American', 'Snacks'],
    rating: 4.2,
    deliveryTime: 25,
    address: '88 Fast Lane, Downtown'
  },
  {
    name: 'Sushi Express',
    image: 'https://images.unsplash.com/photo-1543779508-4b32f0b1c5fa',
    cuisines: ['Sushi', 'Japanese', 'Seafood'],
    rating: 4.8,
    deliveryTime: 35,
    address: '12 Ocean Ave, Riverside'
  }
];

async function seedRestaurants() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await Restaurant.deleteMany({});
  await Restaurant.insertMany(sampleRestaurants);
  console.log('Sample restaurants added!');
  mongoose.disconnect();
}

seedRestaurants();
