import React from 'react';

const variants = {
  h2: {
    tag: 'h2',
    className: 'text-4xl font-bold mb-8',
  },
  h3: {
    tag: 'h3',
    className: 'text-3xl font-medium inline-block mb-6',
  },
  subtitle: {
    tag: 'p',
    className: 'text-base mb-8 text-zinc-500 font-feature-settings-smcp',
  },
  p:{
    tag: 'p',
    className: 'text-xl/9 mb-6',
  }
};

export default function Text({ children, variant = 'h3', className = '', ...props }) {
  const { tag: Tag, className: variantClass } = variants[variant] || variants.h3;
  return (
    <Tag className={`${variantClass} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
