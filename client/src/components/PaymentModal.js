import React, { useState } from 'react';
import theme from '../theme';

function PaymentModal({ open, amount, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 1300);
    }, 1800);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999,
      background: 'rgba(34,40,49,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px) saturate(180%)'
    }}>
      <div style={{
        minWidth: 350, maxWidth: 420, padding: 36, borderRadius: 20, background: 'rgba(255,255,255,0.95)', boxShadow: theme.colors.shadow,
        display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeInScale 0.5s cubic-bezier(.4,0,.2,1)', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 18, right: 18, cursor: 'pointer', fontSize: 24, color: '#888' }} onClick={onClose} title="Close">×</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, letterSpacing: 1, background: 'linear-gradient(90deg,#fc8019,#00f2fe 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Payment</div>
        <div style={{ fontSize: 18, marginBottom: 24 }}>Amount: <span style={{ fontWeight: 700, color: theme.colors.primary }}>₹{amount}</span></div>
        {success ? (
          <>
            <div style={{ fontSize: 48, margin: '24px 0', color: '#00d26a', animation: 'pop 0.7s' }}>✔️</div>
            <div style={{ fontWeight: 600, fontSize: 20, color: '#00d26a', marginBottom: 16 }}>Payment Successful!</div>
          </>
        ) : (
          <>
            <button
              onClick={handlePay}
              disabled={loading}
              style={{
                background: 'linear-gradient(90deg,#fc8019,#00f2fe 80%)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 40px', fontWeight: 700, fontSize: 18, marginBottom: 12, boxShadow: '0 2px 8px #fc801955', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: 1
              }}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
            <div style={{ color: '#888', fontSize: 14 }}>Powered by <span style={{ fontWeight: 600, color: theme.colors.primary }}>Razorpay/Stripe</span></div>
          </>
        )}
      </div>
      <style>{`
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.8);} to { opacity: 1; transform: scale(1);} }
        @keyframes pop { 0% { transform: scale(0.7);} 70% { transform: scale(1.2);} 100% { transform: scale(1);} }
      `}</style>
    </div>
  );
}

export default PaymentModal;
