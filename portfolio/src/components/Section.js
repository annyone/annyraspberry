import React from 'react';
import Text from './Text';

export default function Section({ children, title, className = '', ...props }) {
  const base = 'my-10 gap-12';

  return (
    <section className={`${base} ${className}`} {...props}>
      {title && <Text variant="subtitle">{title}</Text>}
      {children}
    </section>
  );
}
