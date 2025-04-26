import React from 'react';
import { useAddressContext } from '../context/AddressContext';

function AddressSelect({ selected, onChange }) {
  const { addresses, loading } = useAddressContext();

  return (
    <div style={{ margin: '12px 0' }}>
      <label><b>Delivery Address:</b></label>
      {loading ? <div>Loading addresses...</div> : addresses.length === 0 ? <div>No addresses found. Add one in Profile.</div> : (
        <select value={selected} onChange={e => onChange(e.target.value)} style={{ marginLeft: 8, padding: 8 }}>
          <option value="">Select address</option>
          {addresses.map(addr => (
            <option key={addr._id} value={addr._id}>
              {addr.label}: {addr.addressLine}, {addr.city}, {addr.state}, {addr.pincode}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default AddressSelect;
