import React, { useEffect, useState } from 'react';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [assigning, setAssigning] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPartners();
    // Poll every 10s for live updates
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch(`${apiUrl}/orders/all`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const fetchDeliveryPartners = async () => {
    const res = await fetch(`${apiUrl}/auth/delivery-partners`);
    const data = await res.json();
    setDeliveryPartners(data);
  };

  const handleAssign = async (orderId, deliveryPartnerId) => {
    setAssigning(orderId);
    await fetch(`${apiUrl}/orders/${orderId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryPartnerId })
    });
    setAssigning(null);
    fetchOrders();
  };

  const handleStatusChange = async (orderId, status) => {
    await fetch(`${apiUrl}/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
      <h2>Admin/Delivery Dashboard</h2>
      {loading ? <p>Loading orders...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th>Order ID</th>
              <th>Restaurant</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Delivery Partner</th>
              <th>Placed At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{order._id.slice(-6)}</td>
                <td>{order.restaurant?.name || 'N/A'}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {order.items.map(i => <li key={i.menuItem}>{i.name} x {i.qty}</li>)}
                  </ul>
                </td>
                <td>₹{order.total}</td>
                <td><b>{order.status}</b></td>
                <td>
                  <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}>
                    <option value="placed">Placed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <select
                    value={order.deliveryPartner?._id || ''}
                    onChange={e => handleAssign(order._id, e.target.value)}
                    disabled={assigning === order._id}
                  >
                    <option value=''>Assign</option>
                    {deliveryPartners.map(dp => (
                      <option key={dp._id} value={dp._id}>{dp.name} ({dp.email})</option>
                    ))}
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
