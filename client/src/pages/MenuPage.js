import React, { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import theme from '../theme';
import ReviewSection from './ReviewSection';

function MenuPage({ restaurant, onBack, onAddToCart, user, orderId }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    if (restaurant) {
      fetchMenu();
    }
    // eslint-disable-next-line
  }, [restaurant]);

  const fetchMenu = async () => {
    setLoading(true);
    const res = await fetch(`${apiUrl}/menu/${restaurant._id}`);
    const data = await res.json();
    setMenu(data);
    setLoading(false);
  };

  if (!restaurant) return null;

  return (
    <div style={{ maxWidth: 1000, margin: '32px auto', padding: 16 }}>
      <button onClick={onBack} style={{ marginBottom: 20, background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #fc801955', transition: theme.transition }}>← Back</button>
      <GlassCard style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(255,255,255,0.9)' }}>
        <img src={restaurant.image} alt={restaurant.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 12px #fc801933' }} />
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>{restaurant.name}</h2>
          <div style={{ color: '#888', marginBottom: 6, fontSize: 16 }}>{restaurant.cuisines && restaurant.cuisines.join(', ')}</div>
          <div style={{ marginBottom: 6, fontWeight: 500, fontSize: 16 }}><span style={{ color: '#fc8019', fontWeight: 700 }}>⭐ {restaurant.rating}</span> | {restaurant.deliveryTime} min</div>
          <div style={{ color: '#888', fontSize: 15 }}>{restaurant.address}</div>
        </div>
      </GlassCard>
      {loading ? <p>Loading menu...</p> : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          {menu.map(item => (
            <GlassCard key={item._id}
              style={{
                width: 240,
                minHeight: 260,
                cursor: 'pointer',
                border: 'none',
                transition: 'transform 0.2s cubic-bezier(.4,0,.2,1), box-shadow 0.2s',
                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
                background: 'rgba(255,255,255,0.93)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                borderRadius: 18,
                willChange: 'transform',
                padding: 0,
                overflow: 'hidden',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img src={item.image || restaurant.image} alt={item.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderTopLeftRadius: 18, borderTopRightRadius: 18, marginBottom: 0 }} />
              <div style={{ padding: 16 }}>
                <h4 style={{ margin: '8px 0 4px 0', fontWeight: 600, fontSize: 18 }}>{item.name}</h4>
                <div style={{ color: '#888', fontSize: 14 }}>{item.category}</div>
                <div style={{ margin: '6px 0', fontSize: 14 }}>{item.description}</div>
                <div style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>{item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'} | ₹{item.price}</div>
                <button onClick={() => onAddToCart(item)} style={{ background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px #fc801955', transition: theme.transition, width: '100%' }}>Add to Cart</button>
              </div>
            </GlassCard>
          ))}
          {menu.length === 0 && <p>No menu items found.</p>}
        </div>
      )}
      <ReviewSection restaurantId={restaurant._id} user={user} orderId={orderId} />
    </div>
  );
}

export default MenuPage;
