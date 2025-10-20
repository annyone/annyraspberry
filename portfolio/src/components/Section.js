import React from 'react';
import Text from './Text';

export default function Section({ children, title, className = '', ...props }) {
  const base = 'grid grid-cols-1 gap-14';

  return (
    <section className="mb-20" {...props}>
      {title && <Text variant="subtitle" className="mb-8">{title}</Text>}
      <div className={`${base} ${className}`}>
        {children}
      </div>
    </section>
  );
}
