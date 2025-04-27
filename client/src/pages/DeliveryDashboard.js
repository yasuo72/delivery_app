import React, { useState, useEffect } from 'react';

export default function DeliveryDashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    // You may want to fetch only orders assigned to this delivery partner
    const res = await fetch(`/api/orders/delivery/${user._id}`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  return (
    <div>
      <h2 className="swiggy-section-title">Pickup & Delivery Orders</h2>
      {loading ? <div>Loading...</div> : orders.length === 0 ? <div>No deliveries assigned.</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map(order => (
            <li key={order._id} className="swiggy-card" style={{ marginBottom: 18 }}>
              <div><b>Order ID:</b> {order._id}</div>
              <div><b>Restaurant:</b> {order.restaurant?.name || 'N/A'}</div>
              <div><b>Customer:</b> {order.user?.name || 'N/A'}</div>
              <div><b>Status:</b> {order.status}</div>
              <div><b>Address:</b> {order.deliveryAddress}</div>
              <div><b>Placed At:</b> {new Date(order.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
