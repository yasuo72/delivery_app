import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantList from './pages/RestaurantList';
import MenuPage from './pages/MenuPage';
import AdminDashboard from './pages/AdminDashboard';
import ReviewSection from './pages/ReviewSection';
import ProfilePage from './pages/ProfilePage';
import CouponInput from './pages/CouponInput';
import AddressSelect from './pages/AddressSelect';
import GlassCard from './components/GlassCard';
import ThemeToggle from './components/ThemeToggle';
import PaymentModal from './components/PaymentModal';
import SwiggyNavbar from './components/SwiggyNavbar';
import theme from './theme';
import './theme/swiggy.css';
import { AddressProvider } from './context/AddressContext';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [dark, setDark] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleBackToRestaurants = () => setSelectedRestaurant(null);

  const handlePlaceOrder = async () => {
    if (!selectedRestaurant || cart.length === 0 || !selectedAddress) {
      alert('Please select a delivery address.');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    const items = cart.map(i => ({ menuItem: i._id, name: i.name, price: i.price, qty: i.qty }));
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const total = Math.max(0, subtotal - couponDiscount);
    const res = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        restaurantId: selectedRestaurant._id,
        items,
        total,
        couponCode: couponCode || undefined,
        couponDiscount: couponDiscount || undefined,
        addressId: selectedAddress
      })
    });
    if (res.ok) {
      alert('Order placed successfully!');
      setCart([]);
      setSelectedRestaurant(null);
      setCouponDiscount(0);
      setCouponCode('');
      setSelectedAddress('');
      fetchOrderHistory();
    } else {
      alert('Failed to place order.');
    }
  };

  const fetchOrderHistory = async () => {
    const res = await fetch(`http://localhost:5001/api/orders/user/${user._id}`);
    const data = await res.json();
    setOrderHistory(data);
  };

  const handleShowOrders = () => {
    fetchOrderHistory();
    setShowOrders(true);
  };

  const handleHideOrders = () => setShowOrders(false);

  const handleCouponApply = (discount, code) => {
    setCouponDiscount(discount);
    setCouponCode(code);
  };

  useEffect(() => {
    document.body.style.background = dark ? 'linear-gradient(120deg,#232526,#414345 100%)' : 'linear-gradient(120deg,#f8fafc,#e0eafc 100%)';
    document.body.style.transition = 'background 0.5s';
    document.body.style.color = dark ? theme.colors.textDark : theme.colors.text;
  }, [dark]);

  if (user) {
    if (!user._id) {
      alert('Error: user._id is missing! Cannot provide AddressContext.');
      return null;
    }
    return (
      <AddressProvider userId={user._id}>
        <SwiggyNavbar
          page={showProfile ? 'profile' : showAdmin ? 'admin' : showOrders ? 'orders' : selectedRestaurant ? 'home' : 'home'}
          setPage={page => {
            setShowProfile(page === 'profile');
            setShowAdmin(page === 'admin');
            setShowOrders(page === 'orders');
            if (page === 'home') setSelectedRestaurant(null);
          }}
          user={user}
          onLogout={() => { setUser(null); localStorage.removeItem('token'); }}
        />
        <div className="swiggy-content">
          {user.role === 'admin' && showAdmin ? (
            <div className="swiggy-card"><AdminDashboard /></div>
          ) : user.role === 'restaurant' ? (
            <div className="swiggy-card"><RestaurantDashboard user={user} /></div>
          ) : user.role === 'delivery' ? (
            <div className="swiggy-card"><DeliveryDashboard user={user} /></div>
          ) : showProfile ? (
            <div className="swiggy-card"><ProfilePage user={user} /></div>
          ) : showOrders ? (
            <div className="swiggy-card">
              <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <button onClick={handleHideOrders} className="swiggy-btn-primary" style={{ marginBottom: 16 }}>← Back</button>
                <h2 className="swiggy-section-title">Order History</h2>
                {orderHistory.length === 0 ? <div>No orders yet.</div> : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {orderHistory.map(order => (
                      <li key={order._id} style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 16, padding: 16 }}>
                        <div><b>Restaurant:</b> {order.restaurant?.name || 'N/A'}</div>
                        <div><b>Status:</b> {order.status}</div>
                        <div><b>Items:</b>
                          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {order.items.map(item => (
                              <li key={item.menuItem}>{item.name} x {item.qty} (₹{item.price * item.qty})</li>
                            ))}
                          </ul>
                        </div>
                        <div><b>Total:</b> ₹{order.total}</div>
                        <div><b>Placed At:</b> {new Date(order.createdAt).toLocaleString()}</div>
                        <ReviewSection restaurantId={order.restaurant?._id} user={user} orderId={order._id} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : selectedRestaurant ? (
            <div className="swiggy-card">
              <MenuPage restaurant={selectedRestaurant} onBack={handleBackToRestaurants} onAddToCart={handleAddToCart} user={user} />
            </div>
          ) : (
            <div className="swiggy-card">
              <RestaurantList onSelect={setSelectedRestaurant} />
            </div>
          )}
        </div>
        <div className="swiggy-cart">
          <h3 style={{ margin: '0 0 8px 0' }}>Cart</h3>
          {cart.length === 0 ? <div>No items in cart</div> : (
            <>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {cart.map(item => (
                  <li key={item._id} style={{ marginBottom: 8 }}>
                    {item.name} x {item.qty} <span style={{ float: 'right' }}>₹{item.price * item.qty}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 8, fontWeight: 'bold' }}>Subtotal: ₹{cart.reduce((sum, i) => sum + i.price * i.qty, 0)}</div>
              <CouponInput orderTotal={cart.reduce((sum, i) => sum + i.price * i.qty, 0)} onApply={handleCouponApply} />
              {couponDiscount > 0 && <div style={{ color: 'green', fontWeight: 'bold' }}>Coupon: -₹{couponDiscount}</div>}
              <AddressSelect selected={selectedAddress} onChange={setSelectedAddress} />
              <div style={{ marginTop: 4, fontWeight: 'bold' }}>Total: ₹{Math.max(0, cart.reduce((sum, i) => sum + i.price * i.qty, 0) - couponDiscount)}</div>
              <button onClick={handlePlaceOrder} className="swiggy-btn-primary" style={{ marginTop: 10, width: '100%' }}>Place Order</button>
            </>
          )}
        </div>
        <PaymentModal open={showPayment} amount={Math.max(0, cart.reduce((sum, i) => sum + i.price * i.qty, 0) - couponDiscount)} onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />
      </AddressProvider>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins,Segoe UI,sans-serif', minHeight: '100vh', transition: theme.transition, color: dark ? theme.colors.textDark : theme.colors.text }}>
      <h1>Swiggy Clone</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setPage('login')} style={{ marginRight: 8, background: page === 'login' ? '#fc8019' : '#eee', color: page === 'login' ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Login</button>
        <button onClick={() => setPage('register')} style={{ background: page === 'register' ? '#fc8019' : '#eee', color: page === 'register' ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Register</button>
      </div>
      {page === 'login' ? <Login onLogin={setUser} /> : <Register onRegister={() => setPage('login')} />}
    </div>
  );
}

export default App;
