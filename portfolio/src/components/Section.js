import React from 'react';
import Text from './Text';

export default function Section({ children, subtitle, title, last, id, className = '', ...props }) {
  const base = 'grid grid-cols-1 gap-14';

  return (
    <section className={last ? 'mb-4' : 'mb-10 lg:mb-16 xl:mb-20'} {...props}>
      {subtitle && <Text variant="subtitle" className="mb-8">{subtitle}</Text>}
      {title && <Text variant="h3" className="mb-4">{title}</Text>}
      <div id={id} className={`${base} ${className}`}>
        {children}
      </div>
    </section>
  );
}
