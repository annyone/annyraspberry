import React from 'react';
import Text from './Text';

export default function Article({ title, children, last, className = '', ...props }) {
  return (
    <article className={`${last ? 'mb-0' : 'mb-4'} ${className}`} {...props}>
      {title && <Text variant="h4" className="mb-4">{title}</Text>}
          <div className='flex flex-col gap-2'>
        {children}
      </div>
    </article>
  );
}
