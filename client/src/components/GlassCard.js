import React from 'react';
import theme from '../theme';

function GlassCard({ children, style, ...props }) {
  return (
    <div
      style={{
        borderRadius: theme.borderRadius,
        boxShadow: theme.colors.shadow,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.card,
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        padding: 20,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
