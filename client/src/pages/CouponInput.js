import React, { useState } from 'react';

function CouponInput({ orderTotal, onApply }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setDiscount(0);
    const res = await fetch('http://localhost:5001/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderTotal })
    });
    const data = await res.json();
    if (data.valid) {
      setDiscount(data.discount);
      setStatus(data.message);
      onApply(data.discount, code);
    } else {
      setStatus(data.message);
      onApply(0, '');
    }
    setLoading(false);
  };

  return (
    <div style={{ margin: '12px 0' }}>
      <form onSubmit={handleApply} style={{ display: 'flex', gap: 8 }}>
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter coupon code" style={{ padding: 8, flex: 1 }} />
        <button type="submit" disabled={loading} style={{ background: '#fc8019', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Apply</button>
      </form>
      {status && <div style={{ marginTop: 6, color: discount > 0 ? 'green' : 'red' }}>{status}</div>}
    </div>
  );
}

export default CouponInput;
