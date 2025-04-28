import React, { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import theme from '../theme';

function RestaurantList({ onSelect }) {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const apiUrl = process.env.REACT_APP_API_URL || '';
  const fetchRestaurants = async (q = '') => {
    setLoading(true);
    const url = q ? `${apiUrl}/restaurants?q=${encodeURIComponent(q)}` : `${apiUrl}/restaurants`;
    const res = await fetch(url);
    const data = await res.json();
    setRestaurants(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(search);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto', padding: 16 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24, letterSpacing: 0.5, background: 'linear-gradient(90deg,#fc8019,#00f2fe 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Restaurants</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 32, display: 'flex', gap: 10 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or cuisine" style={{ padding: 12, width: 280, borderRadius: 8, border: '1px solid #eee', fontSize: 16, boxShadow: theme.colors.shadow, outline: 'none', transition: theme.transition }} />
        <button type="submit" style={{ padding: '12px 24px', background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #fc801955', transition: theme.transition }}>Search</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'flex-start' }}>
          {restaurants.map(r => (
            <GlassCard key={r._id}
              style={{
                cursor: 'pointer',
                width: 260,
                minHeight: 340,
                padding: 0,
                overflow: 'hidden',
                border: 'none',
                transition: 'transform 0.2s cubic-bezier(.4,0,.2,1), box-shadow 0.2s',
                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                position: 'relative',
                borderRadius: 18,
                willChange: 'transform',
              }}
              onClick={() => onSelect(r)}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img src={r.image} alt={r.name} style={{ width: '100%', height: 150, objectFit: 'cover', borderTopLeftRadius: 18, borderTopRightRadius: 18, marginBottom: 0 }} />
              <div style={{ padding: 18 }}>
                <h3 style={{ margin: '8px 0 4px 0', fontWeight: 600, fontSize: 20 }}>{r.name}</h3>
                <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>{r.cuisines && r.cuisines.join(', ')}</div>
                <div style={{ marginTop: 6, fontWeight: 500, fontSize: 16 }}><span style={{ color: '#fc8019', fontWeight: 700 }}>⭐ {r.rating}</span> | {r.deliveryTime} min</div>
                <div style={{ color: '#888', fontSize: 14, marginTop: 6 }}>{r.address}</div>
              </div>
              <div style={{ position: 'absolute', top: 14, right: 18, background: '#fc8019', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, padding: '4px 12px', boxShadow: '0 2px 8px #fc801955' }}>Open</div>
            </GlassCard>
          ))}
          {restaurants.length === 0 && <p>No restaurants found.</p>}
        </div>
      )}
    </div>
  );
}

export default RestaurantList;
