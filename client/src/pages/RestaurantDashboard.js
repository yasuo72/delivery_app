import React, { useState, useEffect } from 'react';

export default function RestaurantDashboard({ user }) {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const res = await fetch(`http://localhost:5001/api/restaurants/by-owner/${user._id}`);
      const data = await res.json();
      setRestaurant(data);
    };
    fetchRestaurant();
  }, [user]);

  useEffect(() => {
    if (restaurant) fetchMenu();
    // eslint-disable-next-line
  }, [restaurant]);

  const fetchMenu = async () => {
    if (!restaurant) return;
    setLoading(true);
    const res = await fetch(`http://localhost:5001/api/menu/restaurant/${restaurant._id}`);
    const data = await res.json();
    setMenu(data);
    setLoading(false);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleAdd = async e => {
    e.preventDefault();
    if (!restaurant) return;
    setLoading(true);
    const res = await fetch('http://localhost:5001/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, restaurantId: restaurant._id })
    });
    if (res.ok) {
      setForm({ name: '', price: '', image: '' });
      fetchMenu();
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="swiggy-section-title">Manage Menu</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Dish Name" className="swiggy-input" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="swiggy-input" type="number" min="1" required />
        <input type="file" accept="image/*" onChange={handleImageChange} className="swiggy-input" />
        <button type="submit" className="swiggy-btn-primary" disabled={loading}>Add Item</button>
      </form>
      <div className="swiggy-restaurant-list">
        {menu.map(item => (
          <div key={item._id} className="swiggy-restaurant-card" style={{ position: 'relative' }}>
            {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }} />}
            <div className="swiggy-restaurant-title">{item.name}</div>
            <div className="swiggy-restaurant-meta">₹{item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
