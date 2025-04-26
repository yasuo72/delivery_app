import React, { createContext, useContext, useState, useCallback } from 'react';

const AddressContext = createContext();

export function AddressProvider({ userId, children }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const res = await fetch(`http://localhost:5001/api/addresses/user/${userId}`);
    let data = await res.json();
    if (!Array.isArray(data)) data = [];
    setAddresses(data);
    setLoading(false);
  }, [userId]);

  const addAddress = async (address) => {
    // Ensure userId is a valid ObjectId string
    let userIdStr = userId;
    if (userId && typeof userId === 'object' && userId.$oid) userIdStr = userId.$oid;
    if (userIdStr && typeof userIdStr !== 'string') userIdStr = String(userIdStr);
    // Debug log
    console.log('Adding address with userId:', userIdStr, 'address:', address);
    const res = await fetch('http://localhost:5001/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...address, userId: userIdStr })
    });
    if (res.ok) {
      await fetchAddresses();
      return true;
    } else {
      const err = await res.json();
      alert('DEBUG: ' + JSON.stringify({ userId: userIdStr, ...address }));
      throw new Error(err.message || 'Failed to add address');
    }
  };

  const deleteAddress = async (id) => {
    await fetch(`http://localhost:5001/api/addresses/${id}`, { method: 'DELETE' });
    await fetchAddresses();
  };

  return (
    <AddressContext.Provider value={{ addresses, loading, fetchAddresses, addAddress, deleteAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddressContext() {
  return useContext(AddressContext);
}
