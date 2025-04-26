import React, { useState } from 'react';

function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSuccess('Registration successful! Please login.');
      onRegister && onRegister();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8 }}>
          <option value="customer">Customer</option>
          <option value="restaurant">Restaurant</option>
          <option value="delivery">Delivery Partner</option>
        </select>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#fc8019', color: '#fff', border: 'none', borderRadius: 4 }}>Register</button>
        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: 12 }}>{success}</p>}
      </form>
    </div>
  );
}

export default Register;
