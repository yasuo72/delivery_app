const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Restaurant = require('./models/Restaurant');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/swiggy_clone';

const menus = [
  // Pizza Palace
  {
    restaurantName: 'Pizza Palace',
    items: [
      { name: 'Margherita Pizza', description: 'Classic cheese & tomato', price: 199, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591', isVeg: true, category: 'Pizza' },
      { name: 'Pepperoni Pizza', description: 'Pepperoni & cheese', price: 249, image: 'https://images.unsplash.com/photo-1548365328-9c6dbb6f8c57', isVeg: false, category: 'Pizza' },
      { name: 'Garlic Bread', description: 'Crispy garlic bread', price: 99, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', isVeg: true, category: 'Sides' }
    ]
  },
  // Biryani Hub
  {
    restaurantName: 'Biryani Hub',
    items: [
      { name: 'Hyderabadi Biryani', description: 'Spicy chicken biryani', price: 220, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', isVeg: false, category: 'Biryani' },
      { name: 'Veg Biryani', description: 'Mixed veg biryani', price: 180, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', isVeg: true, category: 'Biryani' },
      { name: 'Raita', description: 'Curd with veggies', price: 49, image: '', isVeg: true, category: 'Sides' }
    ]
  },
  // Burger World
  {
    restaurantName: 'Burger World',
    items: [
      { name: 'Veggie Burger', description: 'Crispy veg patty', price: 120, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349', isVeg: true, category: 'Burger' },
      { name: 'Chicken Burger', description: 'Juicy chicken patty', price: 150, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349', isVeg: false, category: 'Burger' },
      { name: 'French Fries', description: 'Golden fries', price: 80, image: '', isVeg: true, category: 'Sides' }
    ]
  },
  // Sushi Express
  {
    restaurantName: 'Sushi Express',
    items: [
      { name: 'Salmon Sushi', description: 'Fresh salmon roll', price: 300, image: 'https://images.unsplash.com/photo-1543779508-4b32f0b1c5fa', isVeg: false, category: 'Sushi' },
      { name: 'Veg Sushi', description: 'Veggie roll', price: 220, image: 'https://images.unsplash.com/photo-1543779508-4b32f0b1c5fa', isVeg: true, category: 'Sushi' },
      { name: 'Miso Soup', description: 'Traditional soup', price: 70, image: '', isVeg: true, category: 'Sides' }
    ]
  }
];

async function seedMenus() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  for (const menu of menus) {
    const restaurant = await Restaurant.findOne({ name: menu.restaurantName });
    if (!restaurant) continue;
    for (const item of menu.items) {
      await MenuItem.create({ ...item, restaurant: restaurant._id });
    }
  }
  console.log('Sample menus added!');
  mongoose.disconnect();
}

seedMenus();
