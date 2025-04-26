import React from 'react';

export default function SwiggyNavbar({ page, setPage, user, onLogout }) {
  return (
    <nav className="swiggy-navbar">
      <span className="swiggy-navbar-logo">Swiggy</span>
      <div className="swiggy-navbar-menu">
        <button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>Home</button>
        <button className={page === 'orders' ? 'active' : ''} onClick={() => setPage('orders')}>Orders</button>
        <button className={page === 'profile' ? 'active' : ''} onClick={() => setPage('profile')}>Profile</button>
        {user && user.role === 'admin' && (
          <button className={page === 'admin' ? 'active' : ''} onClick={() => setPage('admin')}>Admin</button>
        )}
        {user && <button onClick={onLogout}>Logout</button>}
      </div>
    </nav>
  );
}
