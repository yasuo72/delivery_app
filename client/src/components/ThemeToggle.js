import React from 'react';

function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: dark ? '#1a1a2e' : '#fff',
        color: dark ? '#fff' : '#1a1a2e',
        border: 'none',
        borderRadius: 20,
        padding: '8px 18px',
        fontWeight: 600,
        boxShadow: '0 2px 8px #0002',
        cursor: 'pointer',
        marginLeft: 16,
        transition: 'all 0.25s',
      }}
      aria-label="Toggle theme"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

export default ThemeToggle;
