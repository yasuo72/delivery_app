import React, { useEffect, useState } from 'react';
import { useAddressContext } from '../context/AddressContext';

function ProfilePage({ user }) {
  const { addresses, loading, fetchAddresses, addAddress, deleteAddress } = useAddressContext();
  const [form, setForm] = useState({ label: '', addressLine: '', city: '', state: '', pincode: '', phone: '' });

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await addAddress(form);
      setForm({ label: '', addressLine: '', city: '', state: '', pincode: '', phone: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async id => {
    await deleteAddress(id);
  };

  return (
    <div style={{ maxWidth: 600, margin: '32px auto', padding: 16 }}>
      <h2>Profile</h2>
      <div><b>Name:</b> {user.name}</div>
      <div><b>Email:</b> {user.email}</div>
      <h3 style={{ marginTop: 24 }}>Addresses</h3>
      {loading ? <p>Loading...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {addresses.map(addr => (
            <li key={addr._id} style={{ border: '1px solid #eee', borderRadius: 6, marginBottom: 12, padding: 12 }}>
              <div><b>{addr.label}</b>: {addr.addressLine}, {addr.city}, {addr.state}, {addr.pincode}</div>
              <div>Phone: {addr.phone}</div>
              <button onClick={() => handleDelete(addr._id)} style={{ marginTop: 6, background: '#eee', border: 'none', borderRadius: 4, padding: '4px 10px' }}>Delete</button>
            </li>
          ))}
          {addresses.length === 0 && <li>No addresses added.</li>}
        </ul>
      )}
      <form onSubmit={handleAdd} style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: '8px 12px' }}>
        <input name="label" value={form.label} onChange={handleChange} placeholder="Label (e.g. Home, Work)" style={{ flex: 1, padding: 8 }} />
        <input name="addressLine" value={form.addressLine} onChange={handleChange} placeholder="Address Line" style={{ flex: 2, padding: 8 }} required />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" style={{ flex: 1, padding: 8 }} />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" style={{ flex: 1, padding: 8 }} />
        <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" style={{ flex: 1, padding: 8 }} />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={{ flex: 1, padding: 8 }} />
        <button type="submit" style={{ background: '#fc8019', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Add Address</button>
      </form>
    </div>
  );
}

export default ProfilePage;
